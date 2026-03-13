import {
  useGetIdentity,
  Loading,
  Error,
  useLogout,
  useTranslate,
} from "react-admin";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Divider,
  Chip,
  Button,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useHeader } from "../components/HeaderContext";

const Profile = () => {
  const { data: identity, isLoading, error } = useGetIdentity();
  const logout = useLogout();
  const translate = useTranslate();

  useHeader({
    title: translate("custom.user_profile"),
    actions: null,
    showSearch: false,
  });

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ maxWidth: 600 }}>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 4,
          }}
        >
          <Avatar
            src={identity?.avatar}
            alt={identity?.fullName}
            sx={{ width: 120, height: 120, mb: 2, fontSize: "3rem" }}
          >
            {identity?.fullName?.[0]}
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {identity?.fullName}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {identity?.id}
          </Typography>

          <Divider sx={{ width: "100%", my: 3 }} />

          <Box sx={{ width: "100%", mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {translate("custom.roles")}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              <Chip label="USER" variant="outlined" />
            </Box>
          </Box>

          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={() => logout()}
            fullWidth
          >
            {translate("custom.logout")}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;
