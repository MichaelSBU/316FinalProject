/*
    This is our http api, which we use to send requests to
    our back-end API. Note we`re using the Axios library
    for doing this, which is an easy to use AJAX-based
    library. We could (and maybe should) use Fetch, which
    is a native (to browsers) standard, but Axios is easier
    to use when sending JSON back and forth and it`s a Promise-
    based API which helps a lot with asynchronous communication.
    
    @author McKilla Gorilla
*/

import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'http://localhost:4000/api',
})

// THESE ARE ALL THE REQUESTS WE`LL BE MAKING, ALL REQUESTS HAVE A
// REQUEST METHOD (like get) AND PATH (like /top5list). SOME ALSO
// REQUIRE AN id SO THAT THE SERVER KNOWS ON WHICH LIST TO DO ITS
// WORK, AND SOME REQUIRE DATA, WHICH WE WE WILL FORMAT HERE, FOR WHEN
// WE NEED TO PUT THINGS INTO THE DATABASE OR IF WE HAVE SOME
// CUSTOM FILTERS FOR QUERIES
export const createPlaylist = (newListName, userEmail, username, newSongs, likes, dislikes, comments, publishedDate, listens) => {
    return api.post(`/playlist/`, {
        // SPECIFY THE PAYLOAD
        name: newListName,
        ownerEmail: userEmail,
        userName: username,
        songs: newSongs,
        likes: likes,
        dislikes: dislikes,
        comments: comments,
        published: publishedDate,
        listens: listens
    })
}
export const deletePlaylistById = (id) => api.delete(`/playlist/${id}`)
export const getPlaylistById = (id) => api.get(`/playlist/${id}`)
export const getPlaylistByName = (id, name) => api.get(`/playlist/?name=${name}&id=${id}`)
export const getPlaylistPairs = (search) => api.get(`/playlistpairs/?searchValue=${search}`)
export const updatePlaylistById = (id, playlist) => {
    return api.put(`/playlist/${id}`, {
        // SPECIFY THE PAYLOAD
        playlist : playlist
    })
}
export const getPlaylists = (bool, search) => api.get(`/playlists/?flag=${bool}&searchValue=${search}`)

const apis = {
    createPlaylist,
    deletePlaylistById,
    getPlaylistById,
    getPlaylistByName,
    getPlaylistPairs,
    updatePlaylistById,
    getPlaylists
}

export default apis
