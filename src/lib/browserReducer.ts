import { v4 as uuid } from "uuid";
import type {
  BrowserState,
  BrowserAction,
  BrowserTab,
  BrowserSettings,
} from "@/types/browser";
import { NEW_TAB_URL } from "@/lib/url";

function makeTab(incognito = false): BrowserTab {
  return {
    id: uuid(),
    title: "New Tab",
    url: NEW_TAB_URL,
    displayUrl: "",
    favicon: null,
    isLoading: false,
    isIncognito: incognito,
    canGoBack: false,
    canGoForward: false,
    error: null,
    createdAt: Date.now(),
  };
}

const defaultSettings: BrowserSettings = {
  searchEngine: "duckduckgo",
  showBookmarkBar: true,
  fontSize: "medium",
};

export function makeInitialState(): BrowserState {
  const firstTab = makeTab();
  return {
    tabs: [firstTab],
    activeTabId: firstTab.id,
    history: [],
    bookmarks: [],
    bookmarkFolders: [],
    sidebarOpen: false,
    sidebarView: "history",
    showBookmarkBar: true,
    settings: defaultSettings,
    downloads: [],
  };
}

export function browserReducer(
  state: BrowserState,
  action: BrowserAction
): BrowserState {
  switch (action.type) {
    case "NEW_TAB": {
      const tab = makeTab(action.incognito ?? false);
      return { ...state, tabs: [...state.tabs, tab], activeTabId: tab.id };
    }

    case "CLOSE_TAB": {
      if (state.tabs.length === 1) {
        const fresh = makeTab();
        return { ...state, tabs: [fresh], activeTabId: fresh.id };
      }
      const idx = state.tabs.findIndex((t) => t.id === action.tabId);
      const next = state.tabs.filter((t) => t.id !== action.tabId);
      let nextActiveId = state.activeTabId;
      if (state.activeTabId === action.tabId) {
        nextActiveId = next[Math.max(0, idx - 1)]?.id ?? next[0].id;
      }
      return { ...state, tabs: next, activeTabId: nextActiveId };
    }

    case "ACTIVATE_TAB":
      return { ...state, activeTabId: action.tabId };

    case "NAVIGATE":
      return {
        ...state,
        tabs: state.tabs.map((t) =>
          t.id === action.tabId
            ? { ...t, url: action.url, error: null, isLoading: true }
            : t
        ),
      };

    case "TAB_LOADING":
      return {
        ...state,
        tabs: state.tabs.map((t) =>
          t.id === action.tabId ? { ...t, isLoading: true, error: null } : t
        ),
      };

    case "TAB_LOADED":
      return {
        ...state,
        tabs: state.tabs.map((t) =>
          t.id === action.tabId
            ? {
                ...t,
                isLoading: false,
                title: action.title || t.displayUrl || "Untitled",
                favicon: action.favicon,
                error: null,
                canGoBack: true,
              }
            : t
        ),
      };

    case "TAB_ERROR":
      return {
        ...state,
        tabs: state.tabs.map((t) =>
          t.id === action.tabId
            ? { ...t, isLoading: false, error: action.error }
            : t
        ),
      };

    case "TAB_UPDATE_URL":
      return {
        ...state,
        tabs: state.tabs.map((t) =>
          t.id === action.tabId
            ? { ...t, url: action.url, displayUrl: action.displayUrl }
            : t
        ),
      };

    case "TAB_GO_BACK":
    case "TAB_GO_FORWARD":
      return state;

    case "ADD_HISTORY": {
      const activeTab = state.tabs.find((t) => t.id === action.entry.tabId);
      if (activeTab?.isIncognito) return state;
      const entry = { ...action.entry, id: uuid(), visitedAt: Date.now() };
      return { ...state, history: [entry, ...state.history].slice(0, 500) };
    }

    case "CLEAR_HISTORY":
      return { ...state, history: [] };

    case "ADD_BOOKMARK": {
      if (state.bookmarks.some((b) => b.url === action.url)) return state;
      const bm = {
        id: uuid(),
        url: action.url,
        title: action.title,
        favicon: action.favicon,
        createdAt: Date.now(),
        folderId: null,
      };
      return { ...state, bookmarks: [bm, ...state.bookmarks] };
    }

    case "REMOVE_BOOKMARK":
      return {
        ...state,
        bookmarks: state.bookmarks.filter((b) => b.id !== action.id),
      };

    case "TOGGLE_SIDEBAR": {
      const view = action.view ?? state.sidebarView;
      const open =
        state.sidebarOpen && state.sidebarView === view ? false : true;
      return { ...state, sidebarOpen: open, sidebarView: view };
    }

    case "CLOSE_SIDEBAR":
      return { ...state, sidebarOpen: false };

    case "TOGGLE_BOOKMARK_BAR":
      return { ...state, showBookmarkBar: !state.showBookmarkBar };

    case "UPDATE_SETTINGS":
      return {
        ...state,
        settings: { ...state.settings, ...action.settings },
        showBookmarkBar:
          action.settings.showBookmarkBar !== undefined
            ? action.settings.showBookmarkBar
            : state.showBookmarkBar,
      };

    case "ADD_DOWNLOAD": {
      const item = {
        ...action.item,
        id: uuid(),
        startedAt: Date.now(),
      };
      return { ...state, downloads: [item, ...state.downloads] };
    }

    case "UPDATE_DOWNLOAD":
      return {
        ...state,
        downloads: state.downloads.map((d) =>
          d.id === action.id ? { ...d, status: action.status } : d
        ),
      };

    case "CLEAR_DOWNLOADS":
      return { ...state, downloads: [] };

    default:
      return state;
  }
}
