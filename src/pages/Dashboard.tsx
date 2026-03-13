import {
  useGetList,
  Loading,
  Error,
  useDataProvider,
  useNotify,
  useDelete,
} from "react-admin";
import { useState, useMemo, useCallback } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import {
  Grid,
  Card,
  CardActionArea,
  Typography,
  Box,
  IconButton,
  Avatar,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import FolderIcon from "@mui/icons-material/Folder";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  DraggableAttributes,
  SyntheticListenerMap,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useHeader } from "../components/HeaderContext";

interface Application {
  id: string;
  name?: string;
  url?: string;
  iconUrl?: string;
}

interface Category {
  id: string;
  name: string;
  applications?: Application[];
  sortOrder?: number;
}

const ListViewItem = ({
  app,
  handleMenuOpen,
  attributes,
  listeners,
}: {
  app: Application;
  handleMenuOpen: (e: React.MouseEvent<HTMLElement>) => void;
  handleCardClick: () => void;
  attributes: DraggableAttributes;
  listeners: SyntheticListenerMap | undefined;
}) => (
  <Card
    variant="outlined"
    {...attributes}
    {...listeners}
    component="a"
    href={app.url}
    target="_blank"
    rel="noopener noreferrer"
    sx={{
      mb: 0.5,
      display: "flex",
      alignItems: "center",
      transition: "all 0.2s ease-in-out",
      borderRadius: 1,
      cursor: "pointer",
      width: "100%",
      textDecoration: "none",
      color: "inherit",
      "&:hover": {
        borderColor: "primary.main",
        boxShadow: "0 2px 8px 0 rgba(0,0,0,0.05)",
      },
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", p: 1, width: "100%" }}>
      <Avatar
        src={app.iconUrl}
        alt={app.name}
        sx={{
          width: 32,
          height: 32,
          mr: 2,
          bgcolor: "grey.100",
          color: "text.primary",
          fontSize: "0.875rem",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        {app.name?.[0]}
      </Avatar>
      <Box
        sx={{
          flexGrow: 1,
          minWidth: 0,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
          {app.name}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          noWrap
          sx={{ opacity: 0.7 }}
        >
          {app.url ? new URL(app.url).hostname : ""}
        </Typography>
      </Box>
      <Box
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.preventDefault()}
      >
        <IconButton size="small" onClick={handleMenuOpen}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  </Card>
);

const SortableApplication = ({
  app,
  categoryId,
  refetch,
  viewMode,
}: {
  app: Application;
  categoryId: string;
  refetch: () => void;
  viewMode: string;
}) => {
  const navigate = useNavigate();
  const notify = useNotify();
  const [deleteOne] = useDelete();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `app-${app.id}`,
    data: {
      type: "application",
      app,
      categoryId,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setAnchorEl(null);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    handleMenuClose();
    navigate(`/applications/${app.id}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    handleMenuClose();
    if (window.confirm("Are you sure you want to delete this application?")) {
      deleteOne(
        "applications",
        { id: app.id, previousData: app },
        {
          onSuccess: () => {
            notify("Application deleted", { type: "info" });
            refetch();
          },
          onError: (error: Error) =>
            notify(`Error: ${error.message}`, { type: "error" }),
        },
      );
    }
  };

  return (
    <Grid
      size={{
        xs: viewMode === "grid" ? 6 : 12,
        sm: viewMode === "grid" ? 4 : 12,
        md: viewMode === "grid" ? 4 : 12,
        lg: viewMode === "grid" ? 4 : 12,
        xl: viewMode === "grid" ? 3 : 12,
      }}
      ref={setNodeRef}
      style={style}
    >
      {viewMode === "grid" ? (
        <Card
          variant="outlined"
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            transition: "all 0.2s ease-in-out",
            borderRadius: 2,
            "&:hover": {
              borderColor: "primary.main",
              boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
              transform: "translateY(-2px)",
            },
          }}
        >
          <Box sx={{ position: "relative" }}>
            <CardActionArea
              {...attributes}
              {...listeners}
              component="a"
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                p: 1.5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Avatar
                src={app.iconUrl}
                alt={app.name}
                sx={{
                  width: 48,
                  height: 48,
                  mb: 1,
                  bgcolor: "grey.100",
                  color: "text.primary",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                {app.name?.[0]}
              </Avatar>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, lineHeight: 1.2, width: "100%" }}
                noWrap
              >
                {app.name}
              </Typography>
            </CardActionArea>
            <IconButton
              size="small"
              onClick={handleMenuOpen}
              sx={{ position: "absolute", top: 4, right: 4 }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>
        </Card>
      ) : (
        <ListViewItem
          app={app}
          handleMenuOpen={handleMenuOpen}
          handleCardClick={() => {}}
          attributes={attributes}
          listeners={listeners}
        />
      )}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Grid>
  );
};

const SortableCategory = ({
  category,
  onEditClick,
  refetch,
  viewMode,
}: {
  category: Category;
  onEditClick: (id: string) => void;
  refetch: () => void;
  viewMode: string;
}) => {
  const notify = useNotify();
  const [deleteOne] = useDelete();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `cat-${category.id}`,
    data: {
      type: "category",
      category,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    height: "100%",
  };

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setAnchorEl(null);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleMenuClose();
    onEditClick(category.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleMenuClose();
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteOne(
        "categories",
        { id: category.id, previousData: category },
        {
          onSuccess: () => {
            notify("Category deleted", { type: "info" });
            refetch();
          },
          onError: (error: Error) =>
            notify(`Error: ${error.message}`, { type: "error" }),
        },
      );
    }
  };

  return (
    <Grid
      size={{
        xs: 12,
        sm: 12,
        md: viewMode === "grid" ? 12 : 6,
        lg: viewMode === "grid" ? 6 : 6,
        xl: viewMode === "grid" ? 4 : 6,
      }}
      ref={setNodeRef}
      style={style}
    >
      <Box
        sx={{
          p: 2,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          bgcolor: "action.hover",
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <IconButton
            size="small"
            {...attributes}
            {...listeners}
            sx={{ mr: 1, cursor: "grab" }}
          >
            <DragIndicatorIcon fontSize="small" />
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              cursor: "default",
              fontSize: "1.1rem",
            }}
          >
            {category.name}
          </Typography>
          <IconButton size="small" onClick={handleMenuOpen} sx={{ ml: "auto" }}>
            <MoreVertIcon fontSize="inherit" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleEdit}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <SortableContext
          items={category.applications?.map((app) => `app-${app.id}`) || []}
          strategy={
            viewMode === "grid"
              ? rectSortingStrategy
              : verticalListSortingStrategy
          }
        >
          <Grid
            container
            spacing={viewMode === "grid" ? 2 : 1}
            direction={viewMode === "grid" ? "row" : "column"}
          >
            {category.applications?.map((app) => (
              <SortableApplication
                key={app.id}
                app={app}
                categoryId={category.id}
                refetch={refetch}
                viewMode={viewMode}
              />
            ))}
          </Grid>
        </SortableContext>
      </Box>
    </Grid>
  );
};

const Dashboard = () => {
  const [localCategories, setLocalCategories] = useState<Category[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeData, setActiveData] = useState<{
    type: "application" | "category";
    app?: Application;
    category?: Category;
    categoryId?: string;
  } | null>(null);
  const [viewMode, setViewMode] = useState(
    localStorage.getItem("dashboardViewMode") || "grid",
  );

  const handleToggleViewMode = useCallback(() => {
    const newMode = viewMode === "grid" ? "list" : "grid";
    setViewMode(newMode);
    localStorage.setItem("dashboardViewMode", newMode);
  }, [viewMode]);

  const navigate = useNavigate();
  const dataProvider = useDataProvider();
  const notify = useNotify();

  const headerActions = useMemo(() => null, []);

  const {
    data: categories,
    isLoading,
    error,
    refetch,
  } = useGetList<Category>("categories", {
    pagination: { page: 1, perPage: 100 },
    sort: { field: "sortOrder", order: "ASC" },
  });

  const { searchQuery } = useHeader({
    title: "Applications",
    actions: headerActions,
    showSearch: true,
    onRefresh: refetch,
    viewMode: viewMode as "list" | "grid",
    onToggleViewMode: handleToggleViewMode,
  });

  const [lastCategories, setLastCategories] = useState<Category[] | undefined>(
    undefined,
  );
  if (categories !== lastCategories) {
    setLocalCategories(categories || []);
    setLastCategories(categories);
  }

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return localCategories;

    const query = searchQuery.toLowerCase();
    return localCategories
      .map((category: Category) => {
        const categoryNameMatches = category.name.toLowerCase().includes(query);
        const filteredApps = category.applications?.filter(
          (app: Application) =>
            app.name?.toLowerCase().includes(query) ||
            app.url?.toLowerCase().includes(query),
        );

        if (categoryNameMatches || (filteredApps && filteredApps.length > 0)) {
          return {
            ...category,
            applications: categoryNameMatches
              ? category.applications
              : filteredApps,
          };
        }
        return null;
      })
      .filter((category): category is Category => category !== null);
  }, [localCategories, searchQuery]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id.toString());
    setActiveData(
      event.active.data.current as unknown as {
        type: "application" | "category";
        app?: Application;
        category?: Category;
        categoryId?: string;
      },
    );
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeIdStr = active.id.toString();
    const overIdStr = over.id.toString();

    if (
      activeIdStr.startsWith("app-") &&
      overIdStr.startsWith("cat-") &&
      activeData?.app
    ) {
      const activeAppId = activeData.app.id;
      const overCatId = overIdStr.replace("cat-", "");
      const activeCatId = activeData.categoryId;

      if (activeCatId === overCatId) return;

      setLocalCategories((prev) => {
        const newCats = [...prev];
        const activeCat = newCats.find((c) => c.id === activeCatId);
        const overCat = newCats.find((c) => c.id === overCatId);

        if (activeCat && overCat && activeCat.applications) {
          const appIndex = activeCat.applications.findIndex(
            (a: Application) => a.id === activeAppId,
          );
          if (appIndex !== -1) {
            const [app] = activeCat.applications.splice(appIndex, 1);
            if (!overCat.applications) overCat.applications = [];
            overCat.applications.push(app);

            setActiveData({ ...activeData, categoryId: overCatId });
          }
        }
        return newCats;
      });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveData(null);

    if (!over) return;

    const activeIdStr = active.id.toString();
    const overIdStr = over.id.toString();

    if (activeIdStr === overIdStr) return;

    let updatedCategories = [...localCategories];

    if (activeIdStr.startsWith("cat-") && overIdStr.startsWith("cat-")) {
      const oldIndex = updatedCategories.findIndex(
        (c) => `cat-${c.id}` === activeIdStr,
      );
      const newIndex = updatedCategories.findIndex(
        (c) => `cat-${c.id}` === overIdStr,
      );
      updatedCategories = arrayMove(updatedCategories, oldIndex, newIndex);

      updatedCategories = updatedCategories.map((cat, index) => ({
        ...cat,
        sortOrder: index,
      }));

      setLocalCategories(updatedCategories);

      try {
        await dataProvider.reorderCategories({ data: updatedCategories });
        notify("Order saved", { type: "success" });
      } catch {
        notify("Failed to save order", { type: "error" });
        refetch();
      }
    } else if (activeIdStr.startsWith("app-")) {
      let activeCat: Category | undefined;
      let appIndex: number = -1;

      updatedCategories.forEach((cat) => {
        const idx = cat.applications?.findIndex(
          (a: Application) => `app-${a.id}` === activeIdStr,
        );
        if (idx !== -1 && idx !== undefined) {
          activeCat = cat;
          appIndex = idx;
        }
      });

      if (!activeCat || !activeCat.applications) return;

      if (overIdStr.startsWith("app-")) {
        let overCat: Category | undefined;
        let overIndex: number = -1;

        updatedCategories.forEach((cat) => {
          const idx = cat.applications?.findIndex(
            (a: Application) => `app-${a.id}` === overIdStr,
          );
          if (idx !== -1 && idx !== undefined) {
            overCat = cat;
            overIndex = idx;
          }
        });

        if (overCat && overCat.applications) {
          if (activeCat.id === overCat.id) {
            activeCat.applications = arrayMove(
              activeCat.applications,
              appIndex,
              overIndex,
            );
          } else {
            const [app] = activeCat.applications.splice(appIndex, 1);
            overCat.applications.splice(overIndex, 0, app);
          }
        }
      }

      setLocalCategories(updatedCategories);
      try {
        await dataProvider.reorderApplications({ data: updatedCategories });
        notify("Order saved", { type: "success" });
      } catch {
        notify("Failed to save order", { type: "error" });
        refetch();
      }
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <Error error={error} />;
  if (!categories) return null;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, pb: 10 }}>
      {filteredCategories.length === 0 && (
        <Box sx={{ textAlign: "center", mt: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No applications found matching your search.
          </Typography>
        </Box>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredCategories.map((c) => `cat-${c.id}`)}
          strategy={
            viewMode === "grid"
              ? rectSortingStrategy
              : verticalListSortingStrategy
          }
        >
          <Grid container spacing={3}>
            {filteredCategories.map((category) => (
              <SortableCategory
                key={category.id}
                category={category}
                onEditClick={(id: string) => navigate(`/categories/${id}`)}
                refetch={refetch}
                viewMode={viewMode}
              />
            ))}
          </Grid>
        </SortableContext>

        <DragOverlay
          dropAnimation={{
            sideEffects: defaultDropAnimationSideEffects({
              styles: {
                active: {
                  opacity: "0.5",
                },
              },
            }),
          }}
        >
          {activeId ? (
            activeId.toString().startsWith("cat-") ? (
              <Box
                sx={{
                  opacity: 0.8,
                  cursor: "grabbing",
                  bgcolor: "background.paper",
                  p: 2,
                  borderRadius: 2,
                  boxShadow: 10,
                  border: "1px solid",
                  borderColor: "primary.main",
                  minWidth: 300,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "primary.main" }}
                >
                  {activeData?.category?.name}
                </Typography>
                <Divider sx={{ my: 1 }} />
              </Box>
            ) : (
              <Card
                variant="outlined"
                sx={{
                  width: 280,
                  opacity: 0.8,
                  borderRadius: 2,
                  boxShadow: 10,
                  cursor: "grabbing",
                  display: "flex",
                  alignItems: "center",
                  p: 2,
                  bgcolor: "background.paper",
                }}
              >
                <Avatar
                  src={activeData?.app?.iconUrl}
                  sx={{ width: 40, height: 40, mr: 2 }}
                >
                  {activeData?.app?.name?.[0]}
                </Avatar>
                <Typography variant="subtitle2" noWrap>
                  {activeData?.app?.name}
                </Typography>
              </Card>
            )
          ) : null}
        </DragOverlay>
      </DndContext>

      <SpeedDial
        ariaLabel="Add actions"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        <SpeedDialAction
          key="add-app"
          icon={<AddIcon />}
          tooltipTitle="Add App"
          onClick={() => navigate("/applications/create")}
        />
        <SpeedDialAction
          key="add-category"
          icon={<FolderIcon />}
          tooltipTitle="Add Category"
          onClick={() => navigate("/categories/create")}
        />
      </SpeedDial>

      <Outlet context={{ refetch }} />
    </Box>
  );
};

export default Dashboard;
