export type TabId = string;

export interface BrowserTab {
  id: TabId;
  title: string;
  url: string;
  displayUrl: string;
  favicon: string | null;
  isLoading: boolean;
  isIncognito: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  error: string | null;
  createdAt: number;
}

export interface HistoryEntry {
  id: string;
  url: string;
  title: string;
  favicon: string | null;
  visitedAt: number;
  tabId: TabId;
}

export interface Bookmark {
  id: string;
  url: string;
  title: string;
  favicon: string | null;
  createdAt: number;
  folderId: string | null;
}

export interface BookmarkFolder {
  id: string;
  name: string;
  createdAt: number;
}

export interface BrowserSettings {
  searchEngine: "duckduckgo" | "google" | "bing";
  showBookmarkBar: boolean;
  fontSize: "small" | "medium" | "large";
}

export interface BrowserState {
  tabs: BrowserTab[];
  activeTabId: TabId | null;
  history: HistoryEntry[];
  bookmarks: Bookmark[];
  bookmarkFolders: BookmarkFolder[];
  sidebarOpen: boolean;
  sidebarView: "history" | "bookmarks" | "settings" | "downloads";
  showBookmarkBar: boolean;
  settings: BrowserSettings;
  downloads: DownloadItem[];
}

export interface DownloadItem {
  id: string;
  url: string;
  filename: string;
  status: "pending" | "downloading" | "done" | "error";
  startedAt: number;
}

export type BrowserAction =
  | { type: "NEW_TAB"; incognito?: boolean }
  | { type: "CLOSE_TAB"; tabId: TabId }
  | { type: "ACTIVATE_TAB"; tabId: TabId }
  | { type: "NAVIGATE"; tabId: TabId; url: string }
  | { type: "TAB_LOADING"; tabId: TabId }
  | { type: "TAB_LOADED"; tabId: TabId; title: string; favicon: string | null }
  | { type: "TAB_ERROR"; tabId: TabId; error: string }
  | { type: "TAB_UPDATE_URL"; tabId: TabId; url: string; displayUrl: string }
  | { type: "TAB_GO_BACK"; tabId: TabId }
  | { type: "TAB_GO_FORWARD"; tabId: TabId }
  | { type: "ADD_HISTORY"; entry: Omit<HistoryEntry, "id" | "visitedAt"> }
  | { type: "CLEAR_HISTORY" }
  | { type: "ADD_BOOKMARK"; url: string; title: string; favicon: string | null }
  | { type: "REMOVE_BOOKMARK"; id: string }
  | { type: "TOGGLE_SIDEBAR"; view?: BrowserState["sidebarView"] }
  | { type: "CLOSE_SIDEBAR" }
  | { type: "TOGGLE_BOOKMARK_BAR" }
  | { type: "UPDATE_SETTINGS"; settings: Partial<BrowserSettings> }
  | { type: "ADD_DOWNLOAD"; item: Omit<DownloadItem, "id" | "startedAt"> }
  | { type: "UPDATE_DOWNLOAD"; id: string; status: DownloadItem["status"] }
  | { type: "CLEAR_DOWNLOADS" };
