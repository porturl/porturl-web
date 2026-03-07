import { useGetIdentity, Loading, Error, Title } from "react-admin";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Divider,
  Chip,
} from "@mui/material";

const Profile = () => {
  const { data: identity, isLoading, error } = useGetIdentity();

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return (
    <Box sx={{ p: 3 }}>
      <Title title="User Profile" />
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>

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

          <Box sx={{ width: "100%" }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Roles
            </Typography>
            {/* Roles are usually in the token, identity might not have them if not mapped in App.tsx */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              <Chip label="USER" variant="outlined" />
              {/* Add logic to show actual roles if available */}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;
