import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface HeaderContextType {
  title: string;
  setTitle: (title: string) => void;
  actions: ReactNode;
  setActions: (actions: ReactNode) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  onRefresh?: () => void;
  setOnRefresh: (onRefresh?: () => void) => void;
  viewMode?: "list" | "grid";
  setViewMode: (viewMode?: "list" | "grid") => void;
  onToggleViewMode?: () => void;
  setOnToggleViewMode: (onToggle?: () => void) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export const HeaderProvider = ({ children }: { children: ReactNode }) => {
  const [title, setTitle] = useState("");
  const [actions, setActions] = useState<ReactNode>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [onRefresh, setOnRefresh] = useState<(() => void) | undefined>();
  const [viewMode, setViewMode] = useState<"list" | "grid" | undefined>();
  const [onToggleViewMode, setOnToggleViewMode] = useState<
    (() => void) | undefined
  >();

  return (
    <HeaderContext.Provider
      value={{
        title,
        setTitle,
        actions,
        setActions,
        searchQuery,
        setSearchQuery,
        showSearch,
        setShowSearch,
        onRefresh,
        setOnRefresh,
        viewMode,
        setViewMode,
        onToggleViewMode,
        setOnToggleViewMode,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
};
export const useHeader = (config?: {
  title?: string;
  actions?: ReactNode;
  showSearch?: boolean;
  onRefresh?: () => void;
  viewMode?: "list" | "grid";
  onToggleViewMode?: () => void;
}) => {
  const context = useContext(HeaderContext);
  if (!context) throw new Error("useHeader must be used within HeaderProvider");

  const {
    setTitle,
    setActions,
    setShowSearch,
    setOnRefresh,
    setViewMode,
    setOnToggleViewMode,
  } = context;

  useEffect(() => {
    if (config?.title !== undefined) setTitle(config.title);
    if (config?.actions !== undefined) setActions(config.actions);
    if (config?.showSearch !== undefined) setShowSearch(config.showSearch);
    if (config?.onRefresh !== undefined) setOnRefresh(() => config.onRefresh);
    if (config?.viewMode !== undefined) setViewMode(config.viewMode);
    if (config?.onToggleViewMode !== undefined)
      setOnToggleViewMode(() => config.onToggleViewMode);

    return () => {
      // We don't necessarily want to clear it immediately as it might flicker
      // but we could if we wanted to.
    };
  }, [
    config?.title,
    config?.actions,
    config?.showSearch,
    config?.onRefresh,
    config?.viewMode,
    config?.onToggleViewMode,
    setTitle,
    setActions,
    setShowSearch,
    setOnRefresh,
    setViewMode,
    setOnToggleViewMode,
  ]);

  return context;
};
