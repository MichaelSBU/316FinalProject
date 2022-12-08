import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import jsTPS from '../common/jsTPS'
import api from './store-request-api'
import CreateSong_Transaction from '../transactions/CreateSong_Transaction'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction'
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction'
import UpdateSong_Transaction from '../transactions/UpdateSong_Transaction'
import AuthContext from '../auth'
//import YouTubePlayerExample from '../YouTubePlaylisterReact'

/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    RESET: "RESET",
    SET_UP_GUEST_MODE: "SET_UP_GUEST_MODE",
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_PLAYING_LIST: "SET_PLAYING_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    EDIT_SONG: "EDIT_SONG",
    REMOVE_SONG: "REMOVE_SONG",
    HIDE_MODALS: "HIDE_MODALS",
    CHANGE_SORT_TYPE: "CHANGE_SORT_TYPE",
    GO_TO_MY_PLAYLISTS: "GO_TO_MY_PLAYLISTS"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

const CurrentModal = {
    NONE : "NONE",
    DELETE_LIST : "DELETE_LIST",
    EDIT_SONG : "EDIT_SONG",
    REMOVE_SONG : "REMOVE_SONG",
    ERROR : "ERROR"
}

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);

    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        currentModal : CurrentModal.NONE,
        idNamePairs: [],
        currentList: null,
        playingList : null,
        listBeingPlayed: null,
        currentSongIndex : -1,
        currentSong : null,
        listNameActive: false,
        listIdMarkedForDeletion: null,
        listMarkedForDeletion: null,
        sortBy: null,
        searchBy: null,
        searchValue: ""
    });
    const history = useHistory();


    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // ENTER GUEST
            case GlobalStoreActionType.RESET: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: null,
                    currentList: null,
                    playingList : null,
                    currentSongIndex: -1,
                    currentSong: null,
                    listNameActive: null,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    sortBy: null,
                    searchBy: null,
                    searchValue: ""
                });
            }
            // ENTER GUEST
            case GlobalStoreActionType.SET_UP_GUEST_MODE: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: null,
                    currentList: null,
                    playingList : null,
                    currentSongIndex: -1,
                    currentSong: null,
                    listNameActive: null,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    sortBy: null,
                    searchBy: payload,
                    searchValue: ""
                });
            }
            // CHANGE SORT TYPE
            case GlobalStoreActionType.CHANGE_SORT_TYPE: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    playingList : store.playingList,
                    currentSongIndex: store.currentSongIndex,
                    currentSong: store.currentSong,
                    listNameActive: store.listNameActive,
                    listIdMarkedForDeletion: store.listIdMarkedForDeletion,
                    listMarkedForDeletion: store.listMarkedForDeletion,
                    sortBy: payload,
                    searchBy: store.searchBy,
                    searchValue: store.searchValue
                });
            }
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    playingList : store.playingList,
                    currentSongIndex: -1,
                    currentSong: null,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    sortBy: store.sortBy,
                    searchBy: null,
                    searchValue: store.searchValue
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    playingList : store.playingList,
                    currentSongIndex: -1,
                    currentSong: null,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    sortBy: store.sortBy,
                    searchBy: store.searchBy,
                    searchValue: store.searchValue
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {                
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    playingList : store.playingList,
                    currentSongIndex: -1,
                    currentSong: null,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    sortBy: store.sortBy,
                    searchBy: null,
                    searchValue: store.searchValue
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.playlists,
                    currentList: null,
                    playingList : store.playingList,
                    currentSongIndex: -1,
                    currentSong: null,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    sortBy: payload.sortType,
                    searchBy: store.searchBy,
                    searchValue: store.searchValue
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    currentModal : CurrentModal.DELETE_LIST,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    playingList : store.playingList,
                    currentSongIndex: -1,
                    currentSong: null,
                    listNameActive: false,
                    listIdMarkedForDeletion: payload.id,
                    listMarkedForDeletion: payload.playlist,
                    sortBy: store.sortBy,
                    searchBy: store.searchBy,
                    searchValue: store.searchValue
                });
            }
            // UPDATE CURRENT LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    playingList : store.playingList,
                    currentSongIndex: -1,
                    currentSong: null,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    sortBy: store.sortBy,
                    searchBy: store.searchBy,
                    searchValue: store.searchValue
                });
            }
             // UPDATE PLAYING LIST
             case GlobalStoreActionType.SET_PLAYING_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.playlists,
                    currentList: store.currentList,
                    playingList : payload.playingList,
                    currentSongIndex: store.currentSongIndex,
                    currentSong: store.currentSong,
                    listNameActive: store.listNameActive,
                    listIdMarkedForDeletion: store.listIdMarkedForDeletion,
                    listMarkedForDeletion: store.listMarkedForDeletion,
                    sortBy: store.sortBy,
                    searchBy: store.searchBy,
                    searchValue: store.searchValue
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    playingList : store.playingList,
                    currentSongIndex: -1,
                    currentSong: null,
                    listNameActive: true,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    sortBy: store.sortBy,
                    searchBy: null,
                    searchValue: store.searchValue
                });
            }
            // 
            case GlobalStoreActionType.EDIT_SONG: {
                return setStore({
                    currentModal : CurrentModal.EDIT_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    playingList : store.playingList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    sortBy: store.sortBy,
                    searchBy: null,
                    searchValue: store.searchValue
                });
            }
            case GlobalStoreActionType.REMOVE_SONG: {
                return setStore({
                    currentModal : CurrentModal.REMOVE_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    playingList : store.playingList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    sortBy: store.sortBy,
                    searchBy: null,
                    searchValue: store.searchValue
                });
            }
            case GlobalStoreActionType.HIDE_MODALS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    playingList : store.playingList,
                    currentSongIndex: -1,
                    currentSong: null,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    sortBy: store.sortBy,
                    searchBy: store.searchBy,
                    searchValue: store.searchValue
                });
            }
            case GlobalStoreActionType.GO_TO_MY_PLAYLISTS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.playlists,
                    currentList: null,
                    playingList : store.playingList,
                    currentSongIndex: store.currentSongIndex,
                    currentSong: store.currentSong,
                    listNameActive: store.listNameActive,
                    listIdMarkedForDeletion: store.listIdMarkedForDeletion,
                    listMarkedForDeletion: store.listMarkedForDeletion,
                    sortBy: payload.sortBy,
                    searchBy: payload.search,
                    searchValue: payload.searchValue
                });
            }

            default:
                return store;
        }
    }

    store.enterGuestMode = function (){
        auth.loginUser("guest", "p");
        storeReducer({
            type: GlobalStoreActionType.SET_UP_GUEST_MODE,
            payload: true
        });
    }

    store.tryAcessingOtherAccountPlaylist = function(){
        let id = "635f203d2e072037af2e6284";
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: playlist
                });
            }
        }
        asyncSetCurrentList(id);
        history.push("/playlist/635f203d2e072037af2e6284");
    }

    store.addComment = function(comment){
        let list = store.playingList;      
        list.comments.push({postedBy: auth.user.firstName + ' ' + auth.user.lastName, comment: comment})
        // NOW MAKE IT OFFICIAL
        store.updatePlayingList();
    }
    
    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName, x) {
        // GET THE LIST
        async function asyncPlaylistExists(newName){
            let response = await api.getPlaylistByName(id, newName);
            if(response.data.success){
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs(store.searchValue);
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                                store.loadIdNamePairs();
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    } else{
        x.value = "Name Already Used!";
    }
    }
    asyncPlaylistExists(newName)
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        tps.clearAllTransactions();
        history.push("/");
    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        let newListName = "Untitled 0";
        const response = await api.createPlaylist(newListName, auth.user.email, auth.user.userName, [], [], [], [], "no", 0);
        if (response.status === 201) {
            tps.clearAllTransactions();
            let newList = response.data.playlist;
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST
            }
            );
            history.push("/");
            store.loadIdNamePairs();
        }
        else {
        }
    }

    store.sortListsBy = function (sortBy) {
        storeReducer({
            type: GlobalStoreActionType.CHANGE_SORT_TYPE,
            payload: sortBy
        });
        if(store.searchBy===null){
            store.loadIdNamePairs(sortBy);
        } else {
            store.allPlaylists(store.searchBy, store.searchValue, sortBy);
        }
    }

    store.myPlaylists = function (s) {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs(s);
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.GO_TO_MY_PLAYLISTS,
                    payload: {playlists: pairsArray, search: null, searchValue: s, sortBy: store.sortBy}
                });
            }
            else {
            }
        }
        asyncLoadIdNamePairs();
    }

    //flag is true if search playlist by playlistname, flag is false if search playlist by username of user who published the playlist.
    store.allPlaylists = function (flag, searchValue, sortBy) {
        if(sortBy === undefined){
            sortBy = store.sortBy
        }
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylists(flag, searchValue);
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                if(sortBy !== null){
                    pairsArray.sort(sortBy);
                }
                storeReducer({
                    type: GlobalStoreActionType.GO_TO_MY_PLAYLISTS,
                    payload: {playlists: pairsArray, search: flag, searchValue: searchValue, sortBy: sortBy}
                });
            }
            else {
            }
        }
        asyncLoadIdNamePairs();
    }


    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function (sortBy) {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs(store.searchValue);
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                if(store.sortBy !== null){
                    pairsArray.sort(store.sortBy);
                }
                if(sortBy !== undefined && sortBy !== null){
                    pairsArray.sort(sortBy);
                }
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: {playlists: pairsArray, sortType: sortBy}
                });
            }
            else {
            }
        }
        asyncLoadIdNamePairs();
    }

    store.logoutUser = function () {
        storeReducer({type:GlobalStoreActionType.RESET, payload:null});
    }

    store.setPlayingList = function (id) {
        if(auth.user !== "guest"){
        async function asyncSetPlayingList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                if(playlist.published!=="no"){
                    playlist.listens++;
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        if(store.searchBy === null){
                        response = await api.getPlaylistPairs(store.searchValue);
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                if(store.sortBy !== null){
                                    pairsArray.sort(store.sortBy)
                                }
                                storeReducer({
                                    type: GlobalStoreActionType.SET_PLAYING_LIST,
                                    payload: {playingList: playlist, playlists: pairsArray}
                                });
                            }
                        } else {
                            response = await api.getPlaylists(store.searchBy, store.searchValue);
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                if(store.sortBy !== null){
                                    pairsArray.sort(store.sortBy)
                                }
                                storeReducer({
                                    type: GlobalStoreActionType.SET_PLAYING_LIST,
                                    payload: {playingList: playlist, playlists: pairsArray}
                                });
                            }
                        }
                    }
                } else {
                    storeReducer({
                        type: GlobalStoreActionType.SET_PLAYING_LIST,
                        payload: {playingList: playlist, playlists: store.idNamePairs}
                    });
                }
            }
        }
        asyncSetPlayingList(id);
    } else{
        async function asyncSetPlayingList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.SET_PLAYING_LIST,
                    payload: {playingList: playlist, playlists: store.idNamePairs}
                });
            }       
        }
        asyncSetPlayingList(id);
    }
}
    


    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = function (id) {
        async function getListToDelete(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                    payload: {id: id, playlist: playlist}
                });
            }
        }
        getListToDelete(id);
    }
    store.deleteList = function (id) {
        async function processDelete(id) {
            let response = await api.deletePlaylistById(id);
            store.loadIdNamePairs();
            if (response.data.success) {
                history.push("/");
            }
        }
        processDelete(id);
    }
    store.deleteMarkedList = function() {
        store.deleteList(store.listIdMarkedForDeletion);
        store.hideModals();
        
    }

    store.publishPlaylist = function(id) {
        async function pub(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.published = new Date();
                response = await api.updatePlaylistById(playlist._id, playlist);
                store.loadIdNamePairs(store.sortBy);
            }
        }
        pub(id);
    }
    store.duplicatePlaylist = function(id) {
        async function dup(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                response = await api.createPlaylist("Copy of "+playlist.name, auth.user.email, auth.user.userName, playlist.songs, [], [], [], "no", 0);
                if (response.status === 201) {
                    history.push("/");
                    if(store.searchBy === null){
                        store.loadIdNamePairs();
                    }
                }
            }
        }
        dup(id);
    }


    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST

    store.showEditSongModal = (songIndex, songToEdit) => {
        storeReducer({
            type: GlobalStoreActionType.EDIT_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToEdit}
        });        
    }
    store.showRemoveSongModal = (songIndex, songToRemove) => {
        storeReducer({
            type: GlobalStoreActionType.REMOVE_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToRemove}
        });        
    }
    store.hideModals = () => {
        auth.errorMessage = null;
        storeReducer({
            type: GlobalStoreActionType.HIDE_MODALS,
            payload: {}
        });    
    }
    store.isDeleteListModalOpen = () => {
        return store.currentModal === CurrentModal.DELETE_LIST;
    }
    store.isEditSongModalOpen = () => {
        return store.currentModal === CurrentModal.EDIT_SONG;
    }
    store.isRemoveSongModalOpen = () => {
        return store.currentModal === CurrentModal.REMOVE_SONG;
    }
    store.isErrorModalOpen = () => {
        return store.currentModal === CurrentModal.ERROR;
    }

    
    store.like = function (id, bool){
        async function asyncGetList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                if(bool){
                    playlist.likes.push(auth.user.email);
                } else {
                    playlist.dislikes.push(auth.user.email);
                }
                response = await api.updatePlaylistById(playlist._id, playlist);
                if (response.data.success) {
                    if(store.searchBy === null){
                        store.loadIdNamePairs(store.sortBy);
                    } else {
                        store.allPlaylists(store.searchBy, store.searchValue);
                    }
                }
            }
        }
        asyncGetList(id);
    }

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                
                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                }
            }
        }
        asyncSetCurrentList(id);
    }

    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.addNewSong = function() {
        let index = this.getPlaylistSize();
        this.addCreateSongTransaction(index, "Untitled", "?", "dQw4w9WgXcQ");
    }
    // THIS FUNCTION CREATES A NEW SONG IN THE CURRENT LIST
    // USING THE PROVIDED DATA AND PUTS THIS SONG AT INDEX
    store.createSong = function(index, song) {
        let list = store.currentList;      
        list.songs.splice(index, 0, song);
        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
    // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
    store.moveSong = function(start, end) {
        let list = store.currentList;

        // WE NEED TO UPDATE THE STATE FOR THE APP
        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION REMOVES THE SONG AT THE index LOCATION
    // FROM THE CURRENT LIST
    store.removeSong = function(index) {
        let list = store.currentList;      
        list.songs.splice(index, 1); 

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION UPDATES THE TEXT IN THE ITEM AT index TO text
    store.updateSong = function(index, songData) {
        let list = store.currentList;
        let song = list.songs[index];
        song.title = songData.title;
        song.artist = songData.artist;
        song.youTubeId = songData.youTubeId;

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    store.addNewSong = () => {
        let playlistSize = store.getPlaylistSize();
        store.addCreateSongTransaction(
            playlistSize, "Untitled", "?", "dQw4w9WgXcQ");
    }
    // THIS FUNCDTION ADDS A CreateSong_Transaction TO THE TRANSACTION STACK
    store.addCreateSongTransaction = (index, title, artist, youTubeId) => {
        // ADD A SONG ITEM AND ITS NUMBER
        let song = {
            title: title,
            artist: artist,
            youTubeId: youTubeId
        };
        let transaction = new CreateSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }    
    store.addMoveSongTransaction = function (start, end) {
        let transaction = new MoveSong_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }
    // THIS FUNCTION ADDS A RemoveSong_Transaction TO THE TRANSACTION STACK
    store.addRemoveSongTransaction = () => {
        let index = store.currentSongIndex;
        let song = store.currentList.songs[index];
        let transaction = new RemoveSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }
    store.addUpdateSongTransaction = function (index, newSongData) {
        let song = store.currentList.songs[index];
        let oldSongData = {
            title: song.title,
            artist: song.artist,
            youTubeId: song.youTubeId
        };
        let transaction = new UpdateSong_Transaction(this, index, oldSongData, newSongData);        
        tps.addTransaction(transaction);
    }
    store.updateCurrentList = function() {
        async function asyncUpdateCurrentList() {
            const response = await api.updatePlaylistById(store.currentList._id, store.currentList);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
            }
        }
        asyncUpdateCurrentList();
    }

    store.updatePlayingList = function() {
        async function asyncUpdateCurrentList() {
            const response = await api.updatePlaylistById(store.playingList._id, store.playingList);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_PLAYING_LIST,
                    payload: {playingList: store.playingList, playlists: store.idNamePairs}
                });
            }
        }
        asyncUpdateCurrentList();
    }

    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }
    store.canAddNewSong = function() {
        return (store.currentList !== null);
    }
    store.canUndo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToUndo());
    }
    store.canRedo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToRedo());
    }
    store.canClose = function() {
        return (store.currentList !== null);
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    store.rerender = function () {
        setStore({
            currentModal : store.currentModal,
            idNamePairs: store.idNamePairs,
            currentList: store.currentList,
            currentSongIndex: store.currentSongIndex,
            currentSong: store.currentSong,
            listNameActive: store.listNameActive,
            listIdMarkedForDeletion: store.listIdMarkedForDeletion,
            listMarkedForDeletion: store.listMarkedForDeletion
        })
    }

    function KeyPress(event) {
        if (!store.modalOpen && event.ctrlKey){
            if(event.key === 'z'){
                store.undo();
            } 
            if(event.key === 'y'){
                store.redo();
            }
        }
    }
  
    document.onkeydown = (event) => KeyPress(event);


    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };