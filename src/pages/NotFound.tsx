import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <Typography variant="h4" component="h4" gutterBottom>
        Seite nicht gefunden
      </Typography>
      <Typography gutterBottom>
        Die angeforderte Seite existiert nicht.
      </Typography>
      <Button onClick={() => navigate("/")}>Home</Button>
    </div>
  );
}
