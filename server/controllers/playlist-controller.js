const Playlist = require('../models/playlist-model')
const User = require('../models/user-model');
const auth = require('../auth')
/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
    @author McKilla Gorilla
*/
createPlaylist = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    const body = req.body;
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Playlist',
        })
    }
    let playlist = new Playlist(body);
    if (!playlist) {
        return res.status(400).json({ success: false, error: err })
    }
    User.findOne({ _id: req.userId }, async (err, user) => {
    if(playlist.name === "Untitled 0"){
        let flag = true;
        let i = 0;
        while(flag){

            //MODIFYING PLAYLIST NAME BY ADDING '*' UNTIL PLAYLIST NAME IS UNIQUE WITHIN AN ACCOUNT
            await Playlist.findOne({name: "Untitled " + i, ownerEmail: user.email}).then((playlistWithSameName)=> {
                if(playlistWithSameName){
                    i++;
                } else{
                flag = false;
                }
            }).catch(err => console.log(err));

        }
        playlist.name = "Untitled " + i;
    } else {
        let flag = true;
        while(flag){

            //MODIFYING PLAYLIST NAME BY ADDING '*' UNTIL PLAYLIST NAME IS UNIQUE WITHIN AN ACCOUNT
            await Playlist.findOne({name: playlist.name, ownerEmail: user.email}).then((playlistWithSameName)=> {
                if(playlistWithSameName){
                    playlist.name = playlist.name+"*";
                } else{
                flag = false;
                }
            }).catch(err => console.log(err));

        }
    }
        user.playlists.push(playlist._id);
        user
            .save()
            .then(() => {
                playlist
                    .save()
                    .then(() => {
                        return res.status(201).json({
                            playlist: playlist
                        })
                    })
                    .catch(error => {
                        return res.status(400).json({
                            errorMessage: 'Playlist Not Created!'
                        })
                    })
            });
    })
}
deletePlaylist = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    Playlist.findById({ _id: req.params.id }, (err, playlist) => {
        if (err) {
            return res.status(404).json({
                errorMessage: 'Playlist not found!',
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            User.findOne({ email: list.ownerEmail }, (err, user) => {
                if (user._id == req.userId) {
                    Playlist.findOneAndDelete({ _id: req.params.id }, () => {
                        return res.status(200).json({});
                    }).catch(err => console.log(err))
                }
                else {
                    return res.status(400).json({ 
                        errorMessage: "authentication error" 
                    });
                }
            });
        }
        asyncFindUser(playlist);
    })
}
getPlaylistById = async (req, res) => {

    await Playlist.findById({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            console.log(list.ownerEmail)
            await User.findOne({ email: list.ownerEmail }, (err, user) => {
                if (user._id == req.userId || list.published !== "no") {
                    return res.status(200).json({ success: true, playlist: list })
                }
                else {
                    return res.status(400).json({ success: false, description: "authentication error" });
                }
            });
        }
            asyncFindUser(list);
    }).catch(err => console.log(err))
}
getPlaylistByName = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    let namee = req.query.name;
    await User.findOne({ _id: req.userId }, (err, user) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        let email = user.email;
        let id = req.query.id
        async function asyncFindListByName() {
        await Playlist.findOne({ name: namee, ownerEmail: email, _id: {$ne: id} }, (err, list) => {
            if (err) {
                return res.status(400).json({ success: false, error: err });
            }
            if(list){
                return res.status(200).json({success: false, message: "You already have a playlist with that name!"})
            } else {
                return res.status(200).json({success: true, message: "Valid name"})
            }
        });
        }
        asyncFindListByName();
    }).catch(err => console.log(err))
}
getPlaylistPairs = async (req, res) => {
    await User.findOne({ _id: req.userId}, (err, user) => {
        async function asyncFindList(email) {
            await Playlist.find({ ownerEmail: email, name: {$regex: ".*"+req.query.searchValue+".*"} }, (err, playlists) => {
                if (err) {
                    return res.status(400).json({ success: false, error: err })
                }
                if (!playlists) {
                    return res
                        .status(404)
                        .json({ success: false, error: 'Playlists not found' })
                }
                else {
                    // PUT ALL THE LISTS INTO ID, NAME PAIRS.
                    let pairs = [];
                    for (let key in playlists) {
                        let list = playlists[key];
                        let pair = {
                            _id: list._id,
                            name: list.name,
                            playlist: list
                        };
                        pairs.push(pair);
                    }
                    return res.status(200).json({ success: true, idNamePairs: pairs })
                }
            }).catch(err => console.log(err))
        }
            asyncFindList(user.email);
    }).catch(err => console.log(err))
}
getPlaylists = async (req, res) => {
    let searchValue = req.query.searchValue;
    let searchFrom = {name: {$regex: ".*"+searchValue+".*"}, published: {$ne: "no"}};
    if(req.query.flag === "false"){
        searchFrom = {userName: {$regex: ".*"+searchValue+".*"}, published: {$ne: "no"}};
    }
    await Playlist.find(searchFrom, (err, playlists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        else{
                    // PUT ALL THE LISTS INTO ID, NAME PAIRS
                    let pairs = [];
                    for (let key in playlists) {
                        let list = playlists[key];
                        let pair = {
                            _id: list._id,
                            name: list.name,
                            playlist: list
                        };
                        pairs.push(pair);
                    }
                return res.status(200).json({ success: true, idNamePairs: pairs })
        }
    }).catch(err => console.log(err))
}
updatePlaylist = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    const body = req.body
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Playlist.findOne({ _id: req.params.id }, (err, playlist) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Playlist not found!',
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            await User.findOne({ email: list.ownerEmail }, async (err, user) => {
                if (user._id == req.userId || list.published !== "no") {
                    list.name = body.playlist.name;
                    list.userName = body.playlist.userName
                    list.songs = body.playlist.songs;
                    list.likes = body.playlist.likes;
                    list.dislikes = body.playlist.dislikes;
                    list.comments = body.playlist.comments;
                    list.published = body.playlist.published;
                    list.listens = body.playlist.listens;
                    list
                        .save()
                        .then(() => {
                            return res.status(200).json({
                                success: true,
                                id: list._id,
                                message: 'Playlist updated!',
                            })
                        })
                        .catch(error => {
                            return res.status(404).json({
                                error,
                                message: 'Playlist not updated!',
                            })
                        })
                }
                else {
                    return res.status(400).json({ success: false, description: "authentication error" });
                }
            });
        }
        asyncFindUser(playlist);
    })
}
module.exports = {
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getPlaylistByName,
    getPlaylistPairs,
    getPlaylists,
    updatePlaylist
}