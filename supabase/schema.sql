-- ============================================================================
-- Cookie App — Supabase PostgreSQL Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================================================

-- ────────────────────────────────────────────────────────────────────────────
-- 0. Extensions
-- ────────────────────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ────────────────────────────────────────────────────────────────────────────
-- 1. ENUM TYPES
-- ────────────────────────────────────────────────────────────────────────────
CREATE TYPE recipe_difficulty AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE swipe_action      AS ENUM ('liked', 'passed');
CREATE TYPE notification_type AS ENUM ('like', 'comment', 'follow', 'mention', 'recipe_share');

-- ────────────────────────────────────────────────────────────────────────────
-- 2. USERS (public profile — extends auth.users)
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE public.users (
  id               UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username         TEXT UNIQUE NOT NULL,
  full_name        TEXT NOT NULL DEFAULT '',
  avatar_url       TEXT,
  bio              TEXT DEFAULT '',
  followers_count  INTEGER NOT NULL DEFAULT 0,
  following_count  INTEGER NOT NULL DEFAULT 0,
  last_seen_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_users_username ON public.users (lower(username));
CREATE INDEX idx_users_created_at      ON public.users (created_at DESC);

COMMENT ON TABLE public.users IS 'Public user profiles extending Supabase auth.users';

-- ────────────────────────────────────────────────────────────────────────────
-- 3. RECIPES
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE public.recipes (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id          UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title              TEXT NOT NULL,
  description        TEXT DEFAULT '',
  image_url          TEXT,
  difficulty         recipe_difficulty NOT NULL DEFAULT 'easy',
  prep_time_minutes  INTEGER NOT NULL DEFAULT 0 CHECK (prep_time_minutes >= 0),
  calories           INTEGER CHECK (calories >= 0),
  servings           INTEGER NOT NULL DEFAULT 1 CHECK (servings >= 1),
  ingredients        JSONB NOT NULL DEFAULT '[]'::jsonb,
  instructions       JSONB NOT NULL DEFAULT '[]'::jsonb,
  likes_count        INTEGER NOT NULL DEFAULT 0,
  comments_count     INTEGER NOT NULL DEFAULT 0,
  average_rating     REAL NOT NULL DEFAULT 0,
  ratings_count      INTEGER NOT NULL DEFAULT 0,
  fts_doc            tsvector,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ingredients JSONB format:
--   [{ "name": "flour", "amount": "2", "unit": "cups" }, ...]
--
-- instructions JSONB format:
--   [{ "step": 1, "text": "Preheat oven to 350°F" }, ...]

CREATE INDEX idx_recipes_author     ON public.recipes (author_id);
CREATE INDEX idx_recipes_created    ON public.recipes (created_at DESC);
CREATE INDEX idx_recipes_difficulty ON public.recipes (difficulty);
CREATE INDEX idx_recipes_gin_ingredients ON public.recipes USING GIN (ingredients);

COMMENT ON TABLE public.recipes IS 'User-created recipes with embedded ingredients & instructions';

-- ────────────────────────────────────────────────────────────────────────────
-- 4. SAVES / SWIPES  (Tinder-style recipe interactions)
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE public.saves_swipes (
  user_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  recipe_id  UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  action     swipe_action NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, recipe_id)
);

CREATE INDEX idx_saves_swipes_recipe ON public.saves_swipes (recipe_id);
CREATE INDEX idx_saves_swipes_action ON public.saves_swipes (user_id, action);

COMMENT ON TABLE public.saves_swipes IS 'Tracks user liked/passed swipe actions on recipes';

-- ────────────────────────────────────────────────────────────────────────────
-- 5. COMMENTS
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE public.comments (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id  UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  parent_id  UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  content    TEXT NOT NULL CHECK (char_length(content) > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_comments_recipe  ON public.comments (recipe_id, created_at DESC);
CREATE INDEX idx_comments_user    ON public.comments (user_id);
CREATE INDEX idx_comments_parent  ON public.comments (parent_id) WHERE parent_id IS NOT NULL;

COMMENT ON TABLE public.comments IS 'Comments on recipes, supports nested replies via parent_id';

-- ────────────────────────────────────────────────────────────────────────────
-- 6. FOLLOWS
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE public.follows (
  follower_id  UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id <> following_id)
);

CREATE INDEX idx_follows_following ON public.follows (following_id);

COMMENT ON TABLE public.follows IS 'User follow relationships';

-- ────────────────────────────────────────────────────────────────────────────
-- 7. MESSAGES (Direct Messaging)
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE public.messages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id   UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content     TEXT,
  media_url   TEXT,
  metadata    JSONB,
  is_read     BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (sender_id <> receiver_id),
  CHECK (content IS NOT NULL OR media_url IS NOT NULL OR metadata IS NOT NULL)
);

CREATE INDEX idx_messages_conversation ON public.messages (
  LEAST(sender_id, receiver_id),
  GREATEST(sender_id, receiver_id),
  created_at DESC
);
CREATE INDEX idx_messages_receiver_unread ON public.messages (receiver_id, is_read)
  WHERE is_read = false;

COMMENT ON TABLE public.messages IS 'Direct messages between users';

-- ════════════════════════════════════════════════════════════════════════════
-- 8. AUTOMATIC TRIGGERS
-- ════════════════════════════════════════════════════════════════════════════

-- 8a. Auto-create public.users row when a new auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8b. Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER trg_recipes_updated_at
  BEFORE UPDATE ON public.recipes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 8c. Auto-update followers_count / following_count
CREATE OR REPLACE FUNCTION public.update_follow_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.users SET following_count = following_count + 1 WHERE id = NEW.follower_id;
    UPDATE public.users SET followers_count = followers_count + 1 WHERE id = NEW.following_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.users SET following_count = following_count - 1 WHERE id = OLD.follower_id;
    UPDATE public.users SET followers_count = followers_count - 1 WHERE id = OLD.following_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_follow_counts
  AFTER INSERT OR DELETE ON public.follows
  FOR EACH ROW EXECUTE FUNCTION public.update_follow_counts();

-- 8d. Auto-update likes_count on recipes
CREATE OR REPLACE FUNCTION public.update_recipe_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.action = 'liked' THEN
    UPDATE public.recipes SET likes_count = likes_count + 1 WHERE id = NEW.recipe_id;
  ELSIF TG_OP = 'DELETE' AND OLD.action = 'liked' THEN
    UPDATE public.recipes SET likes_count = likes_count - 1 WHERE id = OLD.recipe_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.action = 'liked' AND NEW.action = 'passed' THEN
      UPDATE public.recipes SET likes_count = likes_count - 1 WHERE id = NEW.recipe_id;
    ELSIF OLD.action = 'passed' AND NEW.action = 'liked' THEN
      UPDATE public.recipes SET likes_count = likes_count + 1 WHERE id = NEW.recipe_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_recipe_likes
  AFTER INSERT OR UPDATE OR DELETE ON public.saves_swipes
  FOR EACH ROW EXECUTE FUNCTION public.update_recipe_likes_count();

-- 8e. Auto-update comments_count on recipes
CREATE OR REPLACE FUNCTION public.update_recipe_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.recipes SET comments_count = comments_count + 1 WHERE id = NEW.recipe_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.recipes SET comments_count = comments_count - 1 WHERE id = OLD.recipe_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_recipe_comments
  AFTER INSERT OR DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.update_recipe_comments_count();

-- ════════════════════════════════════════════════════════════════════════════
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ════════════════════════════════════════════════════════════════════════════

-- ──── 9a. USERS ────
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users: anyone can view profiles"
  ON public.users FOR SELECT
  USING (true);

CREATE POLICY "Users: can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users: can delete own profile"
  ON public.users FOR DELETE
  USING (auth.uid() = id);

-- INSERT handled by trigger (SECURITY DEFINER), no direct insert policy needed

-- ──── 9b. RECIPES ────
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Recipes: anyone can read"
  ON public.recipes FOR SELECT
  USING (true);

CREATE POLICY "Recipes: authenticated users can create"
  ON public.recipes FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Recipes: author can update"
  ON public.recipes FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Recipes: author can delete"
  ON public.recipes FOR DELETE
  USING (auth.uid() = author_id);

-- ──── 9c. SAVES_SWIPES ────
ALTER TABLE public.saves_swipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Swipes: users can read own"
  ON public.saves_swipes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Swipes: users can insert own"
  ON public.saves_swipes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Swipes: users can update own"
  ON public.saves_swipes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Swipes: users can delete own"
  ON public.saves_swipes FOR DELETE
  USING (auth.uid() = user_id);

-- ──── 9d. COMMENTS ────
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments: anyone can read"
  ON public.comments FOR SELECT
  USING (true);

CREATE POLICY "Comments: authenticated users can create"
  ON public.comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Comments: author can update own"
  ON public.comments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Comments: author can delete own"
  ON public.comments FOR DELETE
  USING (auth.uid() = user_id);

-- ──── 9e. FOLLOWS ────
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Follows: anyone can see"
  ON public.follows FOR SELECT
  USING (true);

CREATE POLICY "Follows: users can follow"
  ON public.follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Follows: users can unfollow"
  ON public.follows FOR DELETE
  USING (auth.uid() = follower_id);

-- ──── 9f. MESSAGES ────
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Messages: participants can read"
  ON public.messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Messages: authenticated users can send"
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Messages: receiver can mark as read"
  ON public.messages FOR UPDATE
  USING (auth.uid() = receiver_id)
  WITH CHECK (auth.uid() = receiver_id);

CREATE POLICY "Messages: sender can delete own"
  ON public.messages FOR DELETE
  USING (auth.uid() = sender_id);

-- ════════════════════════════════════════════════════════════════════════════
-- 10. STORAGE BUCKETS (for avatars & recipe images)
-- ════════════════════════════════════════════════════════════════════════════

INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('recipes', 'recipes', true);

CREATE POLICY "Avatars: anyone can view"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Avatars: users can upload own"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Avatars: users can update own"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Avatars: users can delete own"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Recipes: anyone can view images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'recipes');

CREATE POLICY "Recipes: authors can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'recipes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Recipes: authors can update images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'recipes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Recipes: authors can delete images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'recipes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ════════════════════════════════════════════════════════════════════════════
-- 11. REVIEWS & REPOSTS
-- ════════════════════════════════════════════════════════════════════════════

CREATE TABLE public.reviews (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id      UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  recipe_id      UUID REFERENCES public.recipes(id) ON DELETE SET NULL,
  dish_name      TEXT NOT NULL,
  restaurant     TEXT,
  location       TEXT,
  rating         INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  content        TEXT NOT NULL,
  images         TEXT[] DEFAULT '{}',
  likes_count    INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0,
  reposts_count  INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.reposts (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('recipe', 'review')),
  target_id   UUID NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.review_likes (
  user_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  review_id  UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, review_id)
);

CREATE OR REPLACE FUNCTION public.update_recipe_rating()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    IF NEW.recipe_id IS NOT NULL THEN
      WITH stats AS (
        SELECT COALESCE(AVG(rating), 0) AS avg_rating, COUNT(*) AS cnt
        FROM public.reviews WHERE recipe_id = NEW.recipe_id
      )
      UPDATE public.recipes SET average_rating = stats.avg_rating, ratings_count = stats.cnt WHERE id = NEW.recipe_id;
    END IF;
  END IF;
  IF TG_OP = 'DELETE' THEN
    IF OLD.recipe_id IS NOT NULL THEN
      WITH stats AS (
        SELECT COALESCE(AVG(rating), 0) AS avg_rating, COUNT(*) AS cnt
        FROM public.reviews WHERE recipe_id = OLD.recipe_id
      )
      UPDATE public.recipes SET average_rating = stats.avg_rating, ratings_count = stats.cnt WHERE id = OLD.recipe_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_update_recipe_rating
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_recipe_rating();

-- ════════════════════════════════════════════════════════════════════════════
-- 12. NOTIFICATIONS
-- ════════════════════════════════════════════════════════════════════════════

CREATE TABLE public.notifications (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  actor_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type         notification_type NOT NULL,
  content      TEXT,
  target_id    UUID,
  is_read      BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user ON public.notifications (user_id, created_at DESC);
CREATE INDEX idx_notifications_read ON public.notifications (user_id, is_read) WHERE is_read = false;

CREATE OR REPLACE FUNCTION public.create_notification()
RETURNS TRIGGER AS $$
DECLARE
  v_receiver_id UUID;
BEGIN
  IF TG_TABLE_NAME = 'saves_swipes' AND NEW.action = 'liked' THEN
    SELECT author_id INTO v_receiver_id FROM public.recipes WHERE id = NEW.recipe_id;
    IF v_receiver_id != NEW.user_id THEN
      INSERT INTO public.notifications (user_id, actor_id, type, target_id)
      VALUES (v_receiver_id, NEW.user_id, 'like', NEW.recipe_id);
    END IF;
  ELSIF TG_TABLE_NAME = 'comments' THEN
    SELECT author_id INTO v_receiver_id FROM public.recipes WHERE id = NEW.recipe_id;
    IF v_receiver_id != NEW.user_id THEN
      INSERT INTO public.notifications (user_id, actor_id, type, target_id, content)
      VALUES (v_receiver_id, NEW.user_id, 'comment', NEW.recipe_id, left(NEW.content, 50));
    END IF;
  ELSIF TG_TABLE_NAME = 'follows' THEN
    v_receiver_id := NEW.following_id;
    IF v_receiver_id != NEW.follower_id THEN
      INSERT INTO public.notifications (user_id, actor_id, type)
      VALUES (v_receiver_id, NEW.follower_id, 'follow');
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_notify_like AFTER INSERT OR UPDATE ON public.saves_swipes FOR EACH ROW EXECUTE FUNCTION public.create_notification();
CREATE TRIGGER trg_notify_comment AFTER INSERT ON public.comments FOR EACH ROW EXECUTE FUNCTION public.create_notification();
CREATE TRIGGER trg_notify_follow AFTER INSERT ON public.follows FOR EACH ROW EXECUTE FUNCTION public.create_notification();

-- ════════════════════════════════════════════════════════════════════════════
-- 13. ADDITIONAL RLS POLICIES
-- ════════════════════════════════════════════════════════════════════════════

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews: anyone can view" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Reviews: auth can create" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Reviews: author can update" ON public.reviews FOR UPDATE USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Reviews: author can delete" ON public.reviews FOR DELETE USING (auth.uid() = author_id);

ALTER TABLE public.reposts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reposts: anyone can view" ON public.reposts FOR SELECT USING (true);
CREATE POLICY "Reposts: auth can create" ON public.reposts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Reposts: user can delete own" ON public.reposts FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE public.review_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Review Likes: anyone can view" ON public.review_likes FOR SELECT USING (true);
CREATE POLICY "Review Likes: auth can create" ON public.review_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Review Likes: user can delete own" ON public.review_likes FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Notifications: users can view own" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Notifications: users can update own" ON public.notifications FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Notifications: users can delete own" ON public.notifications FOR DELETE USING (auth.uid() = user_id);

-- ════════════════════════════════════════════════════════════════════════════
-- 14. FUNCTIONS (Search & Feed)
-- ════════════════════════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "pg_trgm";

CREATE OR REPLACE FUNCTION public.global_search(search_query TEXT)
RETURNS TABLE (
  id          UUID,
  type        TEXT,
  title       TEXT,
  subtitle    TEXT,
  image_url   TEXT,
  rank        REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT r.id, 'recipe'::TEXT, r.title, COALESCE(r.description, ''), r.image_url, 
         ts_rank(r.fts_doc, plainto_tsquery('simple', search_query)) as rank
  FROM public.recipes r
  WHERE r.fts_doc @@ plainto_tsquery('simple', search_query) OR r.title ILIKE '%' || search_query || '%'
  UNION ALL
  SELECT u.id, 'user'::TEXT, u.full_name as title, '@' || u.username as subtitle, u.avatar_url as image_url,
         similarity(u.username, search_query) as rank
  FROM public.users u
  WHERE u.username % search_query OR u.full_name % search_query OR u.username ILIKE '%' || search_query || '%'
  ORDER BY rank DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_following_feed(p_user_id UUID, p_limit INT DEFAULT 20, p_offset INT DEFAULT 0)
RETURNS TABLE (
  item_id UUID,
  item_type TEXT,
  created_at TIMESTAMPTZ,
  data JSONB
) AS $$
BEGIN
  RETURN QUERY
  WITH following AS (
    SELECT following_id FROM public.follows WHERE follower_id = p_user_id
    UNION SELECT p_user_id
  )
  SELECT r.id, 'recipe'::TEXT, r.created_at, to_jsonb(r.*)
  FROM public.recipes r
  WHERE r.author_id IN (SELECT following_id FROM following)
  UNION ALL
  SELECT rev.id, 'review'::TEXT, rev.created_at, to_jsonb(rev.*)
  FROM public.reviews rev
  WHERE rev.author_id IN (SELECT following_id FROM following)
  UNION ALL
  SELECT rep.id, 'repost'::TEXT, rep.created_at, to_jsonb(rep.*)
  FROM public.reposts rep
  WHERE rep.user_id IN (SELECT following_id FROM following)
  ORDER BY created_at DESC
  LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ════════════════════════════════════════════════════════════════════════════
-- DONE ✓
-- ════════════════════════════════════════════════════════════════════════════
