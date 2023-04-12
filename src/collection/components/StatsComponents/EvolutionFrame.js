import React from "react";
import ArrowDownIcon from "@heroicons/react/24/solid/ArrowDownIcon";
import ArrowUpIcon from "@heroicons/react/24/solid/ArrowUpIcon";
import CurrencyDollarIcon from "@heroicons/react/24/solid/CurrencyDollarIcon";
import {
  Avatar,
  Card,
  CardContent,
  SvgIcon,
  Typography,
  Box,
  LinearProgress,
} from "@material-ui/core";

const EvolutionFrame = (props) => {
  const {
    difference,
    positive = false,
    value,
    title,
    percentage,
    icon,
    comparisonPhrase,
  } = props;

  const cardStyle = {
    display: "block",
    transitionDuration: "0.3s",
    height: "150px",
    width: 300,
  };

  const color = positive ? { color: "#06b87f" } : { color: "#cb1515" };

  return (
    <Card sx={{ height: "100%" }} style={cardStyle}>
      <CardContent>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
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
            <Typography color='text.secondary' variant='overline'>
              {title}
            </Typography>

            <Typography variant='h4'>{value}</Typography>
          </div>

          <Avatar
            sx={{
              backgroundColor: "error.main",
              height: 56,
              width: 56,
            }}
            style={{ backgroundColor: "#0097b2" }}
          >
            <SvgIcon>{icon}</SvgIcon>
          </Avatar>
        </div>

        {difference && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 8,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <SvgIcon style={color} fontSize='small'>
                {positive ? <ArrowUpIcon /> : <ArrowDownIcon />}
              </SvgIcon>

              <Typography
                style={{ ...color, marginLeft: 5, fontSize: 15 }}
                variant='body2'
              >
                {difference}%
              </Typography>
            </div>

            <Typography color='text.secondary' variant='caption'>
              {comparisonPhrase}
            </Typography>
          </div>
        )}

        {percentage && (
          <Box sx={{ mt: 3 }}>
            <LinearProgress value={percentage} variant='determinate' />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default EvolutionFrame;
