import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { Box, Button} from '@mui/material';
import { Link } from 'react-router-dom'

export default function SplashScreen() {
    
    const {store} = useContext(GlobalStoreContext);

    function handleGuestMode(){
        store.enterGuestMode(true);
    }

    return (
        <div id="splash-screen">
            <Box sx = {{fontSize: 300, color: "red"}}>Playlister</Box>
            <Box sx = {{fontSize: 100}}>Welcome to Playlister!</Box>
            <Box sx = {{fontSize: 50}}> Create Playlists. Publish Playlists. Browse Playlists. And so much more.</Box>
            <Box sx = {{fontSize: 50}}> With the only playlist app you will ever need... Playlister!</Box>
            <Link style = {{textDecoration: 'none'}} to='/login/'>
            <Button sx={{color: "#8932CC", width: 200, height: 150, fontSize: 30, fontWeight: 'bold', border: 5, p:"8px", mt:"60px"}} variant="outlined" to='/login/'>Login</Button>
            </Link>
            <Link style = {{textDecoration: 'none'}} to='/register/'>
            <Button sx={{color: "#8932CC", width: 200, height: 150, fontSize: 30, fontWeight: 'bold', border: 5, p:"8px", mt:"60px", ml:"100px", mr:"100px"}} variant="outlined" to='/register/'>Create Account</Button>
            </Link>
            <Button sx={{color: "#8932CC", width: 200, height: 150, fontSize: 30, fontWeight: 'bold', border: 5, p:"8px", mt:"60px"}} variant="outlined" onClick={handleGuestMode}>Continue as Guest</Button>
            <Box sx={{ml:"1460px", mt: "160px"}}>Created by Michael Santomauro</Box>
        </div>
    )
}