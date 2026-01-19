import React,{ useState } from "react";
import { addVideoToPlaylist, getUserPlaylists } from "@/api/api";

function AddToPlaylistButton({ videoId }) {
  const [showModal, setShowModal] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState("");

  const token = localStorage.getItem("token");

  const handleOpenModal = async () => {
    if (!token) {
      alert("Please login to use playlists");
      return;
    }

    setShowModal(true);
    setLoading(true);

    try {
      const res = await getUserPlaylists(token);
      setPlaylists(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToPlaylist = async () => {
    if (!selectedPlaylist) {
      alert("Please select a playlist");
      return;
    }

    try {
      await addVideoToPlaylist(selectedPlaylist, videoId, token);
      alert("Video added to playlist!");
      setShowModal(false);
      setSelectedPlaylist("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error adding video to playlist");
    }
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="flex items-center gap-2 px-4 py-2 bg-yt-bg hover:bg-yt-hover rounded-full transition-colors text-yt-text"
        title="Add to Playlist"
      >
        <span className="text-sm">+ Playlist</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-yt-bg rounded-lg p-6 w-96 border border-yt-hover">
            <h2 className="text-xl font-bold mb-4 text-yt-text">Add to Playlist</h2>

            {loading ? (
              <p className="text-center py-4 text-yt-secondary">Loading playlists...</p>
            ) : playlists.length === 0 ? (
              <p className="text-center py-4 text-yt-secondary">
                No playlists found. Create one first!
              </p>
            ) : (
              <>
                <select
                  value={selectedPlaylist}
                  onChange={(e) => setSelectedPlaylist(e.target.value)}
                  className="w-full mb-4 px-4 py-2 rounded-lg bg-yt-dark border border-yt-hover text-yt-text"
                >
                  <option value="">Select a playlist...</option>
                  {playlists.map((playlist) => (
                    <option key={playlist._id} value={playlist._id}>
                      {playlist.name}
                    </option>
                  ))}
                </select>

                <div className="flex gap-3">
                  <button
                    onClick={handleAddToPlaylist}
                    disabled={!selectedPlaylist}
                    className="flex-1 px-4 py-2 bg-yt-red hover:bg-red-700 rounded-lg text-white font-semibold transition-colors disabled:opacity-50"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 bg-yt-hover hover:bg-yt-bg rounded-lg text-yt-text font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default AddToPlaylistButton;
