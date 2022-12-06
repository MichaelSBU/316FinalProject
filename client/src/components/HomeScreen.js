import React, { useState, useContext, useEffect } from 'react'
import GlobalStoreContext from '../store'
import SortMenu from './SortMenu'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'
import HomeIcon from '@mui/icons-material/HomeOutlined';
import Person from '@mui/icons-material/PersonOutline';
import People from '@mui/icons-material/Groups';
import SearchBar from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {Tabs, Tab} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Box from '@mui/material/Box'
import AuthContext from '../auth'
import YouTubePlayer from './YoutubePlayer';
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {

    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);


    const [searchButtons, setSearchButtons] = useState(auth.user === "guest"? 2 : 1);
    const [searchBar, setSearchBar] = useState({value: ""});

    useEffect(() => {
        console.log(auth.user);
        if(auth.user !== "guest"){
            console.log("GURGHRGHRUGRGURGRRUGHURG");
            store.myPlaylists("");
        }
    }, []);

    function handleCreateNewList() {
        store.createNewList();
    }
    let listCard = <Box sx={{width:"50%"}}></Box>;
    /*if(store){
        if(store.searchBy === null){
            listCard = 
<Fab sx={{height:"100%", width:"50%", bgcolor:"transparent"}} color="primary"  aria-label="add"  id="add-list-button" onClick={handleCreateNewList}>
    <AddIcon sx={{color:"black", fontSize:"1000px"}}/>
</Fab>;
        }
    }*/
    if (store) {
        console.log("BFURIUGIUHHUGIRUHIRGIUHGRUIHGRUIHRHIUGR" + store);
        if(store.idNamePairs !== null && store.idNamePairs.length !== 0){
        listCard = 
            <List sx={{bgcolor:"#B8B8B8", width: '50%', overflow: "scroll"}}>
            {
                store.idNamePairs.map((pair) => (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                    />
                ))
                
            }
            </List>;
        }
    }

    //COMMENTS
    let comments = null;
    if (store.playingList !== null){
        comments = 
            <List sx={{transform:"translate(0%,4%)", width: '100%', height: "550px", overflow: "scroll"}}>
            {
                store.playingList.comments.map((c, index) => (
                    <ListItem key = {index} sx={{mt:"5px"}}>
                        <Box sx ={{borderRadius:"5px", width:"100%", bgcolor:"#FFD117"}}>
                            <Typography sx={{ml:"5px", color:"blue", textDecoration:"underline"}}>{c.postedBy}</Typography>
                            <Typography sx={{ml:"5px", fontSize:"24px", color:"black"}}>{c.comment}</Typography>
                            
                        </Box>
                    </ListItem>
                ))
                
            }
            </List>
    }
    function handleAddComment(event) {
        if(auth.user !== "guest"){
        if(store.playingList !== null && store.playingList.published !== "no"){
            console.log(event.target.value);
            if(event.key === "Enter"){
                store.addComment(event.target.value);
                event.target.value="";
            }
        } else {
            event.target.value = "FIRST SELECT A PUBLISHED PLAYLIST TO COMMENT ON!";
        }
    } else {
        event.target.value = "GUESTS CANNOT COMMENT. LOGIN TO COMMENT.";
    }
    }

    //Tab stuff
    const [value, setValue] = useState(0);

    const handleTabs=(event, value)=>{
        console.warn(value);
        setValue(value);
    }
    
    function handleHome(event) {
        event.stopPropagation();
        if(auth.user !== "guest"){
        setSearchButtons(1);
        searchBar.value = "";
        console.log("search         " + store.searchBy);
        store.myPlaylists("");
        }
    }

    function handlePeople(event) {
        event.stopPropagation();
        setSearchButtons(2);
        searchBar.value = "";
        console.log("search         " + store.searchBy);
        if(store.searchBy === null || !store.searchBy){
            store.allPlaylists(true, "abcwir8374n02nf98234.5ng83rg;g';$%^&#(fksnhfismmznxi8310dk485hdnazl");
        }
     }

    function handlePerson(event) {
        event.stopPropagation();
        setSearchButtons(3);
        searchBar.value = "";
        console.log("search         " + store.searchBy);
        if(store.searchBy === null || store.searchBy){
            store.allPlaylists(false, "abcwir8374n02nf98234.5ng83rg;g';$%^&#(fksnhfismmznxi8310dk485hdnazl");
        }
    }

    function handleSearch(event){
        setSearchBar(event.target);
        if(event.key === "Enter" && event.target.value.length > 0){
            console.log(store.searchBy);
            if(store.searchBy !== null){
                store.allPlaylists(store.searchBy, event.target.value);
            } else {
                store.myPlaylists(event.target.value);
            }
        }
    }
    let c = "white";
    if(auth.user === "guest"){
        c = "grey";
    }
    return (
        <Box sx={{height:"94%", width: "100%", bgcolor:"#B8B8B8"}}>
            <Box sx={{width:"100%", height:"8%"}}>
                <HomeIcon onClick={handleHome} sx={{border:searchButtons === 1? 1: 0, mt:"0.2%", ml:"1.1%",fontSize:"60px", color:c}}></HomeIcon>
                <People onClick={handlePeople} sx={{border:searchButtons === 2? 1: 0,ml:"1%", mt:"0.2%",fontSize:"60px", color:"white"}}></People>
                <Person onClick={handlePerson} sx={{border:searchButtons === 3? 1: 0,ml:"1%", mt:"0.2%",fontSize:"60px", color:"white"}}></Person>
                <SearchBar onKeyDown={handleSearch} sx={{ml:"5%", mt:"0.5%", bgcolor:"white", width:"40%", color:"red"}} label="Search" variant="outlined" />
                <Box sx={{width:"100%", transform: "translate(86%, -110%)"}}>
                    <Typography sx={{fontWeight:"bold", fontSize:"30px"}}>Sort By</Typography>
                </Box>
                <Box sx={{width:"100%", transform: "translate(93%, -100%)"}}>
                    <SortMenu></SortMenu>
                </Box>
            </Box>
            <Box sx={{ml:"2%", mr:"2%",  bgcolor:"#B8B8B8"}} >
                <Box sx={{width:"112vw", height: "75vh", display: "flex", direction: "column"}}>
                    {listCard}
                    <Box sx={{height:"6.5%", width:"40vw", bgcolor:"transparent"}}>
                        <Tabs onChange={handleTabs} value = {value}>
                            <Tab sx={{bgcolor:"#AAAAAA", border:3, borderRadius:"30%"}} label='Player'/>
                            <Tab sx={{bgcolor:"#AAAAAA",  border:3, borderRadius:"30%"}} label='Comments'/>
                        </Tabs>
                        <TabPanel value={value} index={0}>
                            <Box sx={{width:"100%", transform:"translate(0%,-5%)"}} bgcolor="B8B8B8">
                                {YouTubePlayer()}
                            </Box>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <Box sx={{transform:"translate(0%, -4.5%)", height: "668px", width:"100%", borderRadius:"5px"}} bgcolor="#cdccff"> 
                                {comments}
                                <SearchBar sx={{transform:"translate(2.5%, 60%)", borderRadius:"10px", bgcolor:"white", width:"95%", color:"red"}} label="Add a Comment" variant="outlined" 
                                onKeyDown={handleAddComment} />
                            </Box>
                        </TabPanel>
                    </Box>
                </Box>
                <MUIDeleteModal />
            </Box>
            <Box sx={{transform:"translate(0%, -12%)", height:"125px", bgcolor:"#B8B8B8"}}>
                <Fab sx={{mt:"1.5%", ml:"40%", bgcolor:"transparent"}} color="primary"  aria-label="add"  id="add-list-button" onClick={handleCreateNewList}>
                    <AddIcon sx={{color:"black", fontSize:"70px"}}/>
                </Fab>
                <Typography sx={{fontSize:70, ml:"40%"}}>Your Lists</Typography>
            </Box>
        </Box>
    );
}
export default HomeScreen;

function TabPanel(props){
    const {children, value, index} = props;
    return(
    <div>
        {
            value===index  && (
                <h1>{children}</h1>
            )
        }
    </div>
    )
}