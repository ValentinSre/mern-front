import React from "react";
import ListBulletIcon from "@heroicons/react/24/solid/ListBulletIcon";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  LinearProgress,
  SvgIcon,
  Typography,
} from "@material-ui/core";

const ProgressionFrame = (props) => {
  const { value } = props;

  const cardStyle = {
    display: "block",
    transitionDuration: "0.3s",
    height: "100%",
  };

  return (
    <Card sx={{ height: "100%" }} style={cardStyle}>
      <CardContent>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
            }}
          >
            <Typography color='text.secondary' gutterBottom variant='overline'>
              Task Progress
            </Typography>

            <Typography variant='h4'>{value}%</Typography>
          </div>

          <Avatar
            sx={{
              backgroundColor: "warning.main",
              height: 56,
              width: 56,
            }}
          >
            <SvgIcon>
              <ListBulletIcon />
            </SvgIcon>
          </Avatar>
        </div>

        <Box sx={{ mt: 3 }}>
          <LinearProgress value={value} variant='determinate' />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProgressionFrame;
