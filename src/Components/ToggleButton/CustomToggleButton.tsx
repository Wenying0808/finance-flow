import * as React from 'react';
import { styled } from '@mui/material/styles';
import { MdOutlineTableRows, MdInsertChartOutlined } from "react-icons/md";
import Paper from '@mui/material/Paper';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup, {
  toggleButtonGroupClasses,
} from '@mui/material/ToggleButtonGroup';

interface ToggleButtonProps {
    view: 'table' | 'chart',
    onViewChange: (newView: 'table' | 'chart') => void
};

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
    color: "#4758DC",
    backgroundColor: "#fff",
    width: "auto",
    height: "32px",
    display:'flex',
    flexDirection: 'row',
    gap: '4px',
    fontSize: '12px',
    "&:hover": {
        backgroundColor: "#E1EBFF",
    },
    "&.Mui-selected": {
        color: "#fff", 
        backgroundColor: "#4758DC",
        "&:hover": {
          backgroundColor: "#4758DC", 
        },
      },
}));

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  [`& .${toggleButtonGroupClasses.grouped}`]: {
    margin: '2px',
    border: 0,
    borderRadius: theme.shape.borderRadius,
    [`&.${toggleButtonGroupClasses.disabled}`]: {
      border: 0,
    },
  },
  [`& .${toggleButtonGroupClasses.middleButton},& .${toggleButtonGroupClasses.lastButton}`]:
    {
      marginLeft: 0,
      borderLeft: '1px solid transparent',
    },
}));

const CustomToggleButton: React.FC<ToggleButtonProps> = ({ view, onViewChange }) => {


  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: 'table' | 'chart',
  ) => {
    onViewChange(newView);
  };

  return (
    <div>
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          border: `1px solid #4758DC`,
          flexWrap: 'wrap',
        }}
      >
        <StyledToggleButtonGroup
          size="small"
          value={view}
          exclusive
          onChange={handleChange}
          aria-label="text alignment"
        >
          <StyledToggleButton value="table" aria-label="table">
            <MdOutlineTableRows style={{ fontSize: "20px" }} />
            Table
          </StyledToggleButton>
          <StyledToggleButton value="plot" aria-label="plot">
            <MdInsertChartOutlined style={{ fontSize: "20px" }}/>
            Chart
          </StyledToggleButton>

        </StyledToggleButtonGroup>
      </Paper>
    </div>
  );
};

export default CustomToggleButton;