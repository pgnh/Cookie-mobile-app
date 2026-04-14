"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react"

type Language = "English" | "Vietnamese"

type Translations = {
  [key: string]: string | Translations
}

const translations: Record<Language, Translations> = {
  English: {
    // Settings - Main
    "settings.title": "Settings",
    "settings.back": "Back",
    "settings.edit": "Edit",
    "settings.account": "Account",
    "settings.preferences": "Preferences",
    "settings.privacy": "Privacy",
    "settings.support": "Support",
    "settings.logout": "Log Out",
    "settings.help": "Help Center",
    
    // Account section
    "account.info.title": "Account Info",
    "account.info.subtitle": "Name, email, phone",
    "security.title": "Security",
    "security.subtitle": "Password, 2FA, login alerts",
    "privacy.title": "Privacy",
    "privacy.subtitle": "Account visibility, data",
    
    // Preferences
    "darkmode.title": "Dark Mode",
    "darkmode.on": "On — Dark theme active",
    "darkmode.off": "Off — Light theme active",
    "language.title": "Language",
    "notifications.title": "Notifications",
    "notifications.enabled": "Enabled",
    "notifications.disabled": "Disabled",
    
    // Privacy toggles
    "privateAccount.title": "Private Account",
    "privateAccount.on": "Only followers can see",
    "privateAccount.off": "Everyone can see",
    "activeStatus.title": "Active Status",
    "activeStatus.on": "Others can see you're active",
    "activeStatus.off": "Active status hidden",
    
    // Account Info Screen
    "accountinfo.header": "Account Info",
    "accountinfo.profile": "Profile",
    "accountinfo.fullname": "Full Name",
    "accountinfo.username": "Username",
    "accountinfo.location": "Location",
    "accountinfo.contact": "Contact",
    "accountinfo.email": "Email",
    "accountinfo.phone": "Phone",
    "accountinfo.personal": "Personal",
    "accountinfo.dob": "Date of Birth",
    "accountinfo.gender": "Gender",
    "accountinfo.account": "Account",
    "accountinfo.memberSince": "Member Since",
    "accountinfo.status": "Account Status",
    "accountinfo.verified": "Verified",
    "accountinfo.active": "Active",
    
    // Security Screen
    "security.header": "Security",
    "security.loginPassword": "Login & Password",
    "security.changePassword": "Change Password",
    "security.lastChanged": "Last changed 3 months ago",
    "security.2fa": "Two-Factor Auth (2FA)",
    "security.2faOn": "Enabled — SMS verification active",
    "security.2faOff": "Add an extra security layer",
    "security.loginAlerts": "Login Alerts",
    "security.loginAlertsOn": "Notify when new device logs in",
    "security.loginAlertsOff": "No alerts for new logins",
    "security.connectedAccounts": "Connected Accounts",
    "security.connected": "Connected",
    "security.notConnected": "Not connected",
    "security.connect": "Connect",
    "security.dangerZone": "Danger Zone",
    "security.blockedUsers": "Blocked Users",
    "security.blockedSubtitle": "Manage blocked accounts",
    "security.deactivate": "Deactivate Account",
    "security.deactivateSubtitle": "Temporarily disable your account",
    
    // Privacy Screen
    "privacy.header": "Privacy",
    "privacy.accountPrivacy": "Account Privacy",
    "privacy.privateAccountOn": "Only approved followers see your content",
    "privacy.privateAccountOff": "Anyone can see your content",
    "privacy.contentInteractions": "Content & Interactions",
    "privacy.whoCanComment": "Who can comment",
    "privacy.whoCanMessage": "Who can message me",
    "privacy.whoCanTag": "Who can tag me",
    "privacy.everyone": "Everyone",
    "privacy.following": "Following",
    "privacy.off": "Off",
    "privacy.dataPrivacy": "Data & Privacy",
    "privacy.downloadData": "Download Your Data",
    "privacy.downloadSubtitle": "Export a copy of your data",
    "privacy.deleteAccount": "Delete Account",
    "privacy.deleteSubtitle": "Permanently remove your account",
    
    // Language Screen
    "language.header": "Language",
    "language.subtitle": "Choose your preferred language for the app interface.",
    "language.english": "English (US)",
    "language.vietnamese": "Vietnamese",
    
    // Notifications Screen
    "notifications.header": "Notifications",
    "notifications.push": "Push Notifications",
    "notifications.allow": "Allow Notifications",
    "notifications.allowOn": "Receiving push notifications",
    "notifications.allowOff": "All notifications paused",
    "notifications.notifyAbout": "Notify Me About",
    "notifications.likes": "Likes",
    "notifications.likesDesc": "When someone likes your post",
    "notifications.comments": "Comments",
    "notifications.commentsDesc": "When someone comments on your post",
    "notifications.followers": "New Followers",
    "notifications.followersDesc": "When someone follows you",
    "notifications.messages": "Messages",
    "notifications.messagesDesc": "When you receive a message",
    "notifications.mentions": "Mentions",
    "notifications.mentionsDesc": "When someone mentions @you",
    "notifications.email": "Email",
    "notifications.emailNotifications": "Email Notifications",
    
    // Bottom Nav
    "nav.home": "Home",
    "nav.discover": "Discover",
    "nav.create": "Create",
    "nav.messages": "Messages",
    "nav.profile": "Profile",
    
    // Top Nav
    "topnav.explore": "Explore",
    "topnav.reviews": "Reviews",
    "topnav.search": "Search...",
    
    // Profile
    "profile.posts": "Posts",
    "profile.recipes": "Recipes",
    "profile.saved": "Saved",
    "profile.followers": "Followers",
    "profile.following": "Following",
    "profile.editProfile": "Edit Profile",
    
    // Login Screen
    "login.title": "Cookie",
    "login.subtitle": "Lifestyle & Recipes",
    "login.tagline": "Discover and share amazing recipes with food lovers worldwide",
    "login.google": "Continue with Google",
    "login.apple": "Continue with Apple",
    "login.phone": "Continue with Phone",
    "login.guest": "Explore as Guest",
    "login.terms": "By continuing, you agree to our",
    "login.termsLink": "Terms of Service",
    "login.and": "and",
    "login.privacyLink": "Privacy Policy",
    
    // Splash Screen
    "splash.lifestyle": "Lifestyle & Recipes",
    
    // Common
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.edit": "Edit",
    "common.done": "Done",
    "common.back": "Back",
    "common.close": "Close",
    "common.loading": "Loading...",
    "common.verified": "Verified",
  },
  
  Vietnamese: {
    // Settings - Main
    "settings.title": "Cài đặt",
    "settings.back": "Quay lại",
    "settings.edit": "Chỉnh sửa",
    "settings.account": "Tài khoản",
    "settings.preferences": "Tùy chọn",
    "settings.privacy": "Riêng tư",
    "settings.support": "Hỗ trợ",
    "settings.logout": "Đăng xuất",
    "settings.help": "Trung tâm trợ giúp",
    
    // Account section
    "account.info.title": "Thông tin tài khoản",
    "account.info.subtitle": "Tên, email, số điện thoại",
    "security.title": "Bảo mật",
    "security.subtitle": "Mật khẩu, xác thực 2 lớp, cảnh báo đăng nhập",
    "privacy.title": "Riêng tư",
    "privacy.subtitle": "Hiển thị tài khoản, dữ liệu",
    
    // Preferences
    "darkmode.title": "Chế độ Tối",
    "darkmode.on": "Bật — Giao diện tối đang hoạt động",
    "darkmode.off": "Tắt — Giao diện sáng đang hoạt động",
    "language.title": "Ngôn ngữ",
    "notifications.title": "Thông báo",
    "notifications.enabled": "Đã bật",
    "notifications.disabled": "Đã tắt",
    
    // Privacy toggles
    "privateAccount.title": "Tài khoản Riêng tư",
    "privateAccount.on": "Chỉ người theo dõi xem được",
    "privateAccount.off": "Mọi người đều xem được",
    "activeStatus.title": "Trạng thái Hoạt động",
    "activeStatus.on": "Người khác thấy bạn đang hoạt động",
    "activeStatus.off": "Ẩn trạng thái hoạt động",
    
    // Account Info Screen
    "accountinfo.header": "Thông tin tài khoản",
    "accountinfo.profile": "Hồ sơ",
    "accountinfo.fullname": "Họ và tên",
    "accountinfo.username": "Tên người dùng",
    "accountinfo.location": "Vị trí",
    "accountinfo.contact": "Liên hệ",
    "accountinfo.email": "Email",
    "accountinfo.phone": "Số điện thoại",
    "accountinfo.personal": "Cá nhân",
    "accountinfo.dob": "Ngày sinh",
    "accountinfo.gender": "Giới tính",
    "accountinfo.account": "Tài khoản",
    "accountinfo.memberSince": "Thành viên từ",
    "accountinfo.status": "Trạng thái tài khoản",
    "accountinfo.verified": "Đã xác minh",
    "accountinfo.active": "Đang hoạt động",
    
    // Security Screen
    "security.header": "Bảo mật",
    "security.loginPassword": "Đăng nhập & Mật khẩu",
    "security.changePassword": "Đổi mật khẩu",
    "security.lastChanged": "Lần cuối đổi 3 tháng trước",
    "security.2fa": "Xác thực 2 lớp (2FA)",
    "security.2faOn": "Đã bật — Xác minh SMS đang hoạt động",
    "security.2faOff": "Thêm lớp bảo mật cho tài khoản",
    "security.loginAlerts": "Cảnh báo đăng nhập",
    "security.loginAlertsOn": "Thông báo khi có thiết bị mới đăng nhập",
    "security.loginAlertsOff": "Không cảnh báo khi đăng nhập mới",
    "security.connectedAccounts": "Tài khoản đã liên kết",
    "security.connected": "Đã liên kết",
    "security.notConnected": "Chưa liên kết",
    "security.connect": "Liên kết",
    "security.dangerZone": "Vùng nguy hiểm",
    "security.blockedUsers": "Người dùng bị chặn",
    "security.blockedSubtitle": "Quản lý tài khoản bị chặn",
    "security.deactivate": "Vô hiệu hóa tài khoản",
    "security.deactivateSubtitle": "Tạm thời vô hiệu hóa tài khoản",
    
    // Privacy Screen
    "privacy.header": "Riêng tư",
    "privacy.accountPrivacy": "Quyền riêng tư tài khoản",
    "privacy.privateAccountOn": "Chỉ người theo dõi đã phê duyệt xem được nội dung",
    "privacy.privateAccountOff": "Mọi người đều xem được nội dung",
    "privacy.contentInteractions": "Nội dung & Tương tác",
    "privacy.whoCanComment": "Ai có thể bình luận",
    "privacy.whoCanMessage": "Ai có thể nhắn tin",
    "privacy.whoCanTag": "Ai có thể gắn thẻ",
    "privacy.everyone": "Mọi người",
    "privacy.following": "Người theo dõi",
    "privacy.off": "Tắt",
    "privacy.dataPrivacy": "Dữ liệu & Riêng tư",
    "privacy.downloadData": "Tải xuống dữ liệu",
    "privacy.downloadSubtitle": "Xuất bản sao dữ liệu của bạn",
    "privacy.deleteAccount": "Xóa tài khoản",
    "privacy.deleteSubtitle": "Xóa vĩnh viễn tài khoản",
    
    // Language Screen
    "language.header": "Ngôn ngữ",
    "language.subtitle": "Chọn ngôn ngữ ưa thích cho giao diện ứng dụng.",
    "language.english": "Tiếng Anh (Mỹ)",
    "language.vietnamese": "Tiếng Việt",
    
    // Notifications Screen
    "notifications.header": "Thông báo",
    "notifications.push": "Thông báo đẩy",
    "notifications.allow": "Cho phép thông báo",
    "notifications.allowOn": "Đang nhận thông báo đẩy",
    "notifications.allowOff": "Tất cả thông báo đã tạm dừng",
    "notifications.notifyAbout": "Thông báo cho tôi về",
    "notifications.likes": "Lượt thích",
    "notifications.likesDesc": "Khi ai đó thích bài viết của bạn",
    "notifications.comments": "Bình luận",
    "notifications.commentsDesc": "Khi ai đó bình luận bài viết của bạn",
    "notifications.followers": "Người theo dõi mới",
    "notifications.followersDesc": "Khi ai đó theo dõi bạn",
    "notifications.messages": "Tin nhắn",
    "notifications.messagesDesc": "Khi bạn nhận được tin nhắn",
    "notifications.mentions": "Nhắc đến",
    "notifications.mentionsDesc": "Khi ai đó nhắc @bạn",
    "notifications.email": "Email",
    "notifications.emailNotifications": "Thông báo qua Email",
    
    // Bottom Nav
    "nav.home": "Trang chủ",
    "nav.discover": "Khám phá",
    "nav.create": "Tạo",
    "nav.messages": "Tin nhắn",
    "nav.profile": "Hồ sơ",
    
    // Top Nav
    "topnav.explore": "Khám phá",
    "topnav.reviews": "Đánh giá",
    "topnav.search": "Tìm kiếm...",
    
    // Profile
    "profile.posts": "Bài viết",
    "profile.recipes": "Công thức",
    "profile.saved": "Đã lưu",
    "profile.followers": "Người theo dõi",
    "profile.following": "Đang theo dõi",
    "profile.editProfile": "Chỉnh sửa hồ sơ",
    
    // Login Screen
    "login.title": "Cookie",
    "login.subtitle": "Lifestyle & Recipes",
    "login.tagline": "Khám phá và chia sẻ công thức tuyệt vời với người yêu ẩm thực trên toàn thế giới",
    "login.google": "Tiếp tục với Google",
    "login.apple": "Tiếp tục với Apple",
    "login.phone": "Tiếp tục với Điện thoại",
    "login.guest": "Khám phá với tư cách khách",
    "login.terms": "Bằng cách tiếp tục, bạn đồng ý với",
    "login.termsLink": "Điều khoản Dịch vụ",
    "login.and": "và",
    "login.privacyLink": "Chính sách Riêng tư",
    
    // Splash Screen
    "splash.lifestyle": "Lifestyle & Recipes",
    
    // Common
    "common.save": "Lưu",
    "common.cancel": "Hủy",
    "common.edit": "Chỉnh sửa",
    "common.done": "Xong",
    "common.back": "Quay lại",
    "common.close": "Đóng",
    "common.loading": "Đang tải...",
    "common.verified": "Đã xác minh",
  }
}

// Create context
interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("English")

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    // Save to localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('cookie-language', lang)
    }
  }, [])

  // Load saved language on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cookie-language') as Language
      if (saved && (saved === "English" || saved === "Vietnamese")) {
        setLanguageState(saved)
      }
    }
  }, [])

  const t = useCallback((key: string): string => {
    const keys = key.split('.')
    let value: unknown = translations[language]
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k]
      } else {
        // Fallback to English if key not found
        let fallback: unknown = translations.English
        for (const fk of keys) {
          if (fallback && typeof fallback === 'object' && fk in fallback) {
            fallback = (fallback as Record<string, unknown>)[fk]
          } else {
            return key // Return key itself if not found anywhere
          }
        }
        return typeof fallback === 'string' ? fallback : key
      }
    }
    
    return typeof value === 'string' ? value : key
  }, [language])

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}
