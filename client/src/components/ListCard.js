import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import List from '@mui/material/List';
import SongCard from './SongCard.js'
import AddIcon from '@mui/icons-material/Add';
import MUIEditSongModal from './MUIEditSongModal'
import MUIRemoveSongModal from './MUIRemoveSongModal'
import AuthContext from '../auth'

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const { idNamePair, selected } = props;
    const { auth } = useContext(AuthContext);
    const email = auth.user.email;

    function handlelistClick(event) {
        console.log("  dddddddd" + store.playingList);
        if(store.currentModal === "NONE"){
            if(event.detail === 1){
                event.stopPropagation();
                store.setPlayingList(idNamePair._id);
            } else if(event.detail === 2){
                event.stopPropagation();
                toggleEdit();
            }
        }
    }

    function handleAddNewSong(event) {
        event.stopPropagation();
        console.log("ADDIDNGGG SOOONNNGGG")
        store.addNewSong();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        let _id = event.target.id;
        _id = ("" + _id).substring("delete-list-".length);
        store.markListForDeletion(id);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = event.target.id.substring("list-".length);
            store.changeListName(id, text);
            toggleEdit();
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }

    async function handleExpand(event, id) {
        event.stopPropagation();
        store.setCurrentList(id);
    }

    async function handleLike(event, id) {
        event.stopPropagation();
        console.log(email);
        console.log(idNamePair.playlist.likes);
        if(!idNamePair.playlist.likes.includes(email) && !idNamePair.playlist.dislikes.includes(email)){
            store.like(id, true);
        }
    }

    async function handleDislike(event, id) {
        event.stopPropagation();
        if(!idNamePair.playlist.likes.includes(email) && !idNamePair.playlist.dislikes.includes(email)){
            store.like(id, false);
        }
    }

    async function handlePublish(event, id){
        event.stopPropagation();
        store.publishPlaylist(id);
    }

    async function handleDuplicate(event, id){
        event.stopPropagation();
        store.duplicatePlaylist(id);
    }

    async function handleMinimize(event, id) {
        event.stopPropagation();
        store.closeCurrentList();
    }

    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }
    let cardStatus = false;
    if (store.isListNameEditActive) {
        cardStatus = true;
    }

    let modalJSX = "";
    if (store.isEditSongModalOpen()) {
        modalJSX = <MUIEditSongModal />;
    }
    else if (store.isRemoveSongModalOpen()) {
        modalJSX = <MUIRemoveSongModal />;
    }

    let month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let likeDislike = null;
    let publishListen = null;
    let mle = "92%";
    let gsfe = 12;
    let coc = "#faecb9";
    let boc = 2;
    if(idNamePair.playlist.published !== "no"){
        boc = 4;
        coc="#cdccff";
        gsfe = 1;
        mle = "0%";
        likeDislike=
            <Grid item md={4} sx={{transform:"translate(0%, 10%)"}}>
                <IconButton onClick={(event) => {handleLike(event, idNamePair._id)}} aria-label='like'>
                    <ThumbUpOffAltIcon style={{fontSize:'42pt'}} />
                </IconButton>
                <Typography sx={{fontWeight:"bold", fontSize:"24px"}} display="inline">{idNamePair.playlist.likes.length}</Typography>
                <IconButton onClick={(event) => {handleDislike(event, idNamePair._id)}} sx={{ml:"10%"}} aria-label='dislike'>
                    <ThumbDownOffAltIcon style={{fontSize:'42pt'}} />
                </IconButton>
                <Typography sx={{fontWeight:"bold", fontSize:"24px"}} display="inline">{idNamePair.playlist.dislikes.length}</Typography>
            </Grid>;
        if(idNamePair.playlist.likes.includes(email)){
            likeDislike=
            <Grid item md={4} sx={{transform:"translate(0%, 10%)"}}>
                
                    <ThumbUpAltIcon style={{fontSize:'42pt'}} />
                
                <Typography sx={{fontWeight:"bold", fontSize:"24px"}} display="inline">{idNamePair.playlist.likes.length}</Typography>
                
                    <ThumbDownOffAltIcon style={{fontSize:'42pt'}} />
                
                <Typography sx={{fontWeight:"bold", fontSize:"24px"}} display="inline">{idNamePair.playlist.dislikes.length}</Typography>
            </Grid>;
        }
        if(idNamePair.playlist.dislikes.includes(email)){
            likeDislike=
            <Grid item md={4} sx={{transform:"translate(0%, 10%)"}}>
                
                    <ThumbUpOffAltIcon style={{fontSize:'42pt'}} />
                
                <Typography sx={{fontWeight:"bold", fontSize:"24px"}} display="inline">{idNamePair.playlist.likes.length}</Typography>
                
                    <ThumbDownAltIcon style={{fontSize:'42pt'}} />
                
                <Typography sx={{fontWeight:"bold", fontSize:"24px"}} display="inline">{idNamePair.playlist.dislikes.length}</Typography>
            </Grid>;
        } 
        if(auth.user === "guest"){
            likeDislike=
            <Grid item md={4} sx={{transform:"translate(0%, 10%)"}}>
                
                    <ThumbUpOffAltIcon style={{fontSize:'42pt'}} />
                
                <Typography sx={{fontWeight:"bold", fontSize:"24px"}} display="inline">{idNamePair.playlist.likes.length}</Typography>
                
                    <ThumbDownOffAltIcon style={{fontSize:'42pt'}} />
                
                <Typography sx={{fontWeight:"bold", fontSize:"24px"}} display="inline">{idNamePair.playlist.dislikes.length}</Typography>
            </Grid>;
        }

        publishListen = 
            <Grid item md={11}>
                <Typography display="inline" sx={{fontSize: 14}}>{"Published: "}</Typography>
                <Typography display="inline" sx={{fontWeight:"bold", color: "green", fontSize: 14}}>{
                month[idNamePair.playlist.published.substring(5, 7)-1] + " " + idNamePair.playlist.published.substring(8, 10) + ", " + idNamePair.playlist.published.substring(0, 4)
                }</Typography>
                <Typography display="inline" sx={{ml: "60%", fontSize: 14}}>{"Listens: "}</Typography>
                <Typography display="inline" sx={{fontWeight:"bold", color: "red", fontSize: 14}}>{idNamePair.playlist.listens}</Typography>
            </Grid>
    }
    if(store.playingList !== null){
        if(idNamePair.playlist.name === store.playingList.name && idNamePair.playlist.listens === store.playingList.listens){
            console.log("PPLAYING PLAYLIST MAKE GOLD FIBRGRUGUIHGRBIUGIRUHIHUGRHIUGRIHUGR");
            coc = "#FFD117"
        }
    }

    let s = 50;
    if(idNamePair.name.length > 23){
        s = 30;
        if(idNamePair.name.length > 40){
            s = 22;
        }
    }
    //Minimized Card #########################################################################################################################################################
    let cardElement =
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            sx={{border:boc, borderRadius:"15px", p: 1, bgcolor: coc, marginBottom:"10px", display: 'flex', height: 132}}
            button
            onClick={(event) => {
                handlelistClick(event)
            }}
        > 
        <Container sx={{paddingTop:"20px"}}>
        <Grid container>
            <Grid item md={8}>
                <Typography sx={{fontSize: s}}>{idNamePair.name}</Typography>
            </Grid>
            {likeDislike}
            <Grid item md={12}> 
                <Typography sx={{fontSize: 20}}>{"By: " + idNamePair.playlist.userName}</Typography>
            </Grid>
            {publishListen}
            <Grid item md={gsfe}>
                <IconButton sx = {{ml: mle, transform: "translate(0%, -50%)"}} onClick={(event) => {handleExpand(event, idNamePair._id)}} aria-label='delete'>
                    <KeyboardDoubleArrowDownIcon sx={{fontSize:'32pt'}} />
                </IconButton>
            </Grid>
            </Grid>
            </Container>
        </ListItem>







    //Expanded Card #######################################################################################################################################################
    if(store.currentList !== null && store.currentList._id === idNamePair._id){
        let db = <Button sx={{bgcolor:"grey", color:"black", ml:"10%"}}onClick={(event) => {handleDuplicate(event, idNamePair._id)}} >duplicate</Button>
        if(store.searchBy === null){
            db = 
            <Box><Button sx={{bgcolor:"grey", color:"black", ml:"1%"}} onClick={(event) => {handleDeleteList(event, idNamePair._id)}}>delete</Button>
                 <Button sx={{bgcolor:"grey", color:"black", ml:"1%"}}onClick={(event) => {handleDuplicate(event, idNamePair._id)}} >duplicate</Button></Box>
        }
        if(auth.user === "guest"){
            db = null;
        }
        let esf = <List sx={{height:"300px", width: "100%", display: "flex", flexDirection: "column", overflow: "scroll"}} >
            {
            store.currentList.songs.map((song, index) => (
                <SongCard
                    id={'playlist-song-' + (index)}
                    key={'playlist-song-' + (index)}
                    index={index}
                    song={song}
                />
            ))
        }
            {modalJSX}
            <Button
            sx={{borderRadius:10, ml:"1%", width:"98%"}}
            disabled={!store.canAddNewSong()}
            id='add-song-button'
            onClick={handleAddNewSong}
            variant="contained">
            <AddIcon />
            </Button>
        </List>
        let ebuttons = <Box>
                            <Button sx={{bgcolor:"grey", color:"black"}}>undo</Button>
                            <Button sx={{bgcolor:"grey", color:"black", ml:"1%"}}>redo</Button>
                            <Button onClick = {(event) => {handlePublish(event, idNamePair._id)}} sx={{bgcolor:"grey", color:"black", ml:"52%"}}>publish</Button>
                            <Button onClick = {(event) => {handleDuplicate(event, idNamePair._id)}} sx={{bgcolor:"grey", color:"black", ml:"1%"}}>duplicate</Button>
                            <Button sx={{bgcolor:"grey", color:"black", ml:"1%"}} onClick={(event) => {handleDeleteList(event, idNamePair._id)}}>delete</Button>
                    </Box>  
        if(idNamePair.playlist.published !== "no"){
            esf = 
            <List sx={{bgcolor:"#3a32a8", height:"300px", width: "100%", display: "flex", flexDirection: "column", overflow: "scroll"}} >
                {
                    store.currentList.songs.map((song, index) => (
                        <Box sx={{height:"50px"}}>
                            <Typography fontWeight="bold" color="#dea23b" fontSize="24px">{index+1 + ". " + song.title}</Typography>
                        </Box>
                    ))
                 }
                </List>
            ebuttons = <Box sx={{transform:"translate(80%, 0%)"}}>
            {db}
        </Box>
        }


        cardElement =
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            sx={{borderRadius:"10px", p: 1, bgcolor: coc, marginTop: '15px', display: 'flex', height: 520}}
            style={{transform:"translate(1%,0%)", width: '98%'}}
            button
            onClick={(event) => {
                handlelistClick(event)
            }}
        > 
        <Container>
        <Grid container>
            <Grid item md={8}>
                <Typography sx={{fontSize: s}}>{idNamePair.name}</Typography>
            </Grid>
            {likeDislike}
            <Grid item md={12}> 
                <Typography sx={{fontSize: 20}}>{"By: " + idNamePair.playlist.userName}</Typography>
            </Grid>
            <Grid item md={12}>
                {esf}
            </Grid>
            <Grid sx={{mt:"1%"}} item md={12}>
                {ebuttons}
            </Grid>
            {publishListen}
            <Grid item md={12}>
                <IconButton sx={{transform:"translate(1700%, -30%)"}} onClick={(event) => {handleMinimize(event, idNamePair._id)}} aria-label='delete'>
                    <KeyboardDoubleArrowUpIcon sx={{fontSize:'25pt'}} />
                </IconButton>
            </Grid>
            </Grid>
            </Container>
        </ListItem>
    } 
    
    //Editing Card #########################################################################################################################################################
    if (editActive) {
        cardElement =
            <TextField
                margin="normal"
                required
                fullWidth
                id={"list-" + idNamePair._id}
                label="Playlist Name"
                name="name"
                autoComplete="Playlist Name"
                className='list-card'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={idNamePair.name}
                inputProps={{style: {fontSize: 48}}}
                InputLabelProps={{style: {fontSize: 24}}}
                autoFocus
            />
    }

    
    return (
        cardElement
    );
}

export default ListCard;