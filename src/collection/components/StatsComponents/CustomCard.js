import React from "react";
import PropTypes from "prop-types";
import { Box, Typography, Avatar } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";

const StyledCard = styled(Box)({
  backgroundColor: "#fff",
  borderRadius: 8,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  height: 120,
  width: 180,
  padding: "16px",
});

const Title = styled(Typography)({
  color: "#999",
  fontSize: 12,
  textTransform: "uppercase",
});

const Value = styled(Typography)({
  color: "#000",
  fontWeight: "bold",
  fontSize: 24,
  display: "flex",
  alignItems: "center",
});

const CustomCard = ({ title, value, sign, icon }) => {
  return (
    <StyledCard>
      <Avatar color='#f44336'>{icon}</Avatar>
      <Title>{title}</Title>
      <Value>
        {value}
        {sign && <span style={{ fontSize: 16, marginLeft: 4 }}>{sign}</span>}
      </Value>
    </StyledCard>
  );
};

CustomCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  sign: PropTypes.string,
  icon: PropTypes.element.isRequired,
};

export default CustomCard;
