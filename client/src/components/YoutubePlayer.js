import React, {useContext, useState} from 'react';
import YouTube from 'react-youtube';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import GlobalStoreContext from '../store'

export default function YouTubePlayer() {
    
    const {store} = useContext(GlobalStoreContext);
    
    const [p, setP] = useState(null);
    const [song, setSong] = useState({title: "CHOOSE A PLAYLIST", artist: "CHOOSE A PLAYLIST"});
    const [currentSong, setCurrentSong] = useState(0);
    const [currentPlaylist, setCurrentPlaylist] = useState(store.playingList);

    if(currentPlaylist !== store.playingList){
        setCurrentPlaylist(store.playingList);
        setCurrentSong(0);
    }
    // THIS HAS THE YOUTUBE IDS FOR THE SONGS IN OUR CURRENTLY PLAYING PLAYLIST
    let name = "SELECT A PLAYLIST TO PLAY IT!"
    let playlist = [];
    let wholePlaylist = null;
    if(store.playingList !== null){
        name = store.playingList.name;
        wholePlaylist = store.playingList;
        for(let i = 0; i < store.playingList.songs.length; i++){
            playlist.push(store.playingList.songs[i].youTubeId);
        }
    }

    const playerOptions = {
        height: '390',
        width: '670',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
        },
    };

    // THIS FUNCTION LOADS THE CURRENT SONG INTO
    // THE PLAYER AND PLAYS IT
    function loadAndPlayCurrentSong(player) {
        let song = playlist[currentSong];
        setSong({title: wholePlaylist.songs[currentSong].title, artist: wholePlaylist.songs[currentSong].artist});
        player.loadVideoById(song);
        player.playVideo();
    }

    function onPlayerReady(event) {
        if(store.playingList !== null && store.playingList.songs.length > 0){
            setP(event.target);
            loadAndPlayCurrentSong(event.target);
            event.target.playVideo();
        }
    }

    // THIS IS OUR EVENT HANDLER FOR WHEN THE YOUTUBE PLAYER'S STATE
    // CHANGES. NOTE THAT playerStatus WILL HAVE A DIFFERENT INTEGER
    // VALUE TO REPRESENT THE TYPE OF STATE CHANGE. A playerStatus
    // VALUE OF 0 MEANS THE SONG PLAYING HAS ENDED.
    function onPlayerStateChange(event) {
        if(store.playingList !== null && store.playingList.songs.length > 0){
        let playerStatus = event.data;
        setP(event.target);
        if (playerStatus === -1) {
            // VIDEO UNSTARTED
            if(currentSong >=1){
                p.playVideo();
            }
        } else if (playerStatus === 0) {
            // THE VIDEO HAS COMPLETED PLAYING
            handleNextSong();
            p.playVideo();
        } else if (playerStatus === 1) {
            // THE VIDEO IS PLAYED
        } else if (playerStatus === 2) {
            // THE VIDEO IS PAUSED
        } else if (playerStatus === 3) {
            // THE VIDEO IS BUFFERING
        } else if (playerStatus === 5) {
        }
    }
}

    const handlePrevSong = () => {
        if(store.playingList !== null && store.playingList.songs.length > 0){
        setCurrentSong((playlist.length+currentSong-1) % playlist.length);
        setSong({title: wholePlaylist.songs[currentSong].title, artist: wholePlaylist.songs[currentSong].artist});
        loadAndPlayCurrentSong(p);
        p.playVideo();
        }
    }
    const handlePauseSong = () => {
        if(store.playingList != null && store.playingList.songs.length > 0){
        p.pauseVideo();
        }
    }
    const handlePlaySong = () => {
        if(store.playingList !== null && store.playingList.songs.length > 0){
        p.playVideo();
        }
    }
    const handleNextSong = () => {
        if(store.playingList !== null && store.playingList.songs.length > 0){
        setCurrentSong((currentSong+1) % playlist.length);
        setSong({title: wholePlaylist.songs[currentSong].title, artist: wholePlaylist.songs[currentSong].artist});
        loadAndPlayCurrentSong(p);
        p.playVideo();
        }
    }
    let songNumb = "CHOOSE A PLAYLIST"
    if(store.playingList !== null){
        songNumb = (currentSong+1);
        if(store.playingList.songs.length <= 0){
            songNumb = "THE SELECTED PLAYLIST HAS NO SONGS";
        }
    }

    let sx = {pointerEvent:"none", transform:"translate(0%,1%)"}
    if(store.playingList !== null && store.playingList.songs.length > 0){
        sx = {transform:"translate(0%,1%)"}
    }

    let title = song.title;
    let artist = song.artist;
    if(store.playingList !== null && store.playingList.songs.length <= 0){
        title = "THE SELECTED PLAYLIST HAS NO SONGS";
        artist = "THE SELECTED PLAYLIST HAS NO SONGS";
    }
    //WRAP YOUTUBE IN <Box sx={{pointerEvents: "none"}}> put here </Box> IF IT NEEDS TO BE UNCLICKABLE
    
    return <Box sx={sx}>
    <YouTube videoId={playlist[currentSong]} opts={playerOptions} onReady={onPlayerReady} onStateChange={onPlayerStateChange}></YouTube>
    <Box sx={{pb: 1.5, transform:"translate(0%, -3%)", height: "100%", borderRadius:"12px", border: 1,  bgcolor:"#cdccff"}}>
                                    <Typography sx={{ml:"40%", fontSize:25}}>Now Playing</Typography>
                                    <Typography sx={{ml:"20px", fontSize:25}}>{"Playlist: " + name}</Typography>
                                    <Typography sx={{ml:"20px", fontSize:25}}>{"Song #: " + songNumb}</Typography>
                                    <Typography sx={{ml:"20px", fontSize:25}}>{"Title:   " + title}</Typography>
                                    <Typography sx={{ml:"20px", fontSize:25}}>{"Artist:   " + artist}</Typography>
                                    <Box sx={{border:2, height:"75px", borderColor:"black", borderRadius:5, ml:"3%", width:"94%", bgcolor:"white", fontSize:"75px"}}>
                                        <FastRewindIcon onClick={handlePrevSong} sx={{ml: "30%"}} fontSize="inherit"></FastRewindIcon>
                                        <PauseIcon onClick={handlePauseSong} fontSize="inherit"></PauseIcon>
                                        <PlayArrowIcon onClick={handlePlaySong} fontSize="inherit"></PlayArrowIcon>
                                        <FastForwardIcon onClick={handleNextSong} fontSize="inherit"></FastForwardIcon>
                                    </Box>
                                    
    </Box>
    </Box>;
}
