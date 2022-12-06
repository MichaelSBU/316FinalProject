import * as React from 'react';
import Box from '@mui/material/Box';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useContext } from 'react'
import GlobalStoreContext from '../store';

export default function SortMenu() {
  const {store} = useContext(GlobalStoreContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  }

  const handleNameSort = () => {
    store.sortListsBy(function(a, b){return a.name.localeCompare(b.name)})
    setAnchorEl(null);
  }

  const handleCreationSort = () => {
    store.sortListsBy(function(a, b){return a.playlist.createdAt.localeCompare(b.playlist.createdAt)})
    setAnchorEl(null);
  }

  const handleUpdatedSort = () => {
    store.sortListsBy(function(a, b){return b.playlist.updatedAt.localeCompare(a.playlist.updatedAt)})
    setAnchorEl(null);
  }

  const handlePublishSort = () => {
    store.sortListsBy(function(a, b){return a.playlist.published.localeCompare(b.playlist.published)})
    setAnchorEl(null);
  }

  const handleListensSort = () => {
    store.sortListsBy(function(a, b){return b.playlist.listens-(a.playlist.listens)})
    setAnchorEl(null);
  }

  const handleLikesSort = () => {
    store.sortListsBy(function(a, b){return b.playlist.likes.length-(a.playlist.likes.length)})
    setAnchorEl(null);
  }

  const handleDislikesSort = () => {
    store.sortListsBy(function(a, b){return b.playlist.dislikes.length-(a.playlist.dislikes.length)})
    setAnchorEl(null);
  }
  
  let sortOptions= 
  <Menu
        id="sort-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleNameSort}>Name (A - Z)</MenuItem>
        <MenuItem onClick={handlePublishSort}>Publish Date (Newest)</MenuItem>
        <MenuItem onClick={handleListensSort}>Listens (High - Low)</MenuItem>
        <MenuItem onClick={handleLikesSort}>Likes (High - Low)</MenuItem>
        <MenuItem onClick={handleDislikesSort}>Dislikes (High - Low)</MenuItem>
      </Menu>
  if(store.searchBy === null){
    sortOptions = 
    <Menu
    id="sort-menu"
    anchorEl={anchorEl}
    open={open}
    onClose={handleClose}
    MenuListProps={{
      'aria-labelledby': 'basic-button',
    }}
  >
    <MenuItem onClick={handleCreationSort}>Creation Date (Old-New)</MenuItem>
    <MenuItem onClick={handleUpdatedSort}>Last Edit Date (New-Old)</MenuItem>
    <MenuItem onClick={handleNameSort}>Name (A - Z)</MenuItem>
  </Menu>
  }

  return (
    <Box fontSize="100px">
      <MenuIcon
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        fontSize="inherit"
      >
      </MenuIcon>
      {sortOptions}
    </Box>
  );
}