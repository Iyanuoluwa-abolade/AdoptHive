import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import { FiCamera } from "react-icons/fi";

function Profile() {
  const { user, updateUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [setVideoStream] = useState(null);

  function handleLogout() {
    updateUser(null);
    localStorage.removeItem("user");
    navigate("/signin");
  }

  function handleFileInput(e) {
    setSelectedFile(e.target.files[0]);
    setImageUrl(null);
  }

  function handleUpload() {
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  }

  function takePhoto() {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        setVideoStream(stream);
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();
        const canvas = document.createElement('canvas');
        canvas.width = 50;
        canvas.height = 50;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, 640, 480);
        const imageData = canvas.toDataURL('image/jpeg');
        setImageUrl(imageData);
      })
      .catch(error => {
        return ('Error taking photo:', error);
      });
  }

  return (
    <div className="profile">
      <label className="profile-image-upload">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Uploaded Image"
            className="profile-image"
          />
        ) : (
          <div className="profile-image-placeholder">
            <FiCamera className="camera-icon" onClick={takePhoto} />
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          capture="camera"
          onChange={handleFileInput}
        />
      </label>
      <p>User: {user.FirstName}</p>
      <p>Role: {user.role}</p>

      {selectedFile && !imageUrl && (
        <button onClick={handleUpload}>Upload File</button>
      )}
      <button className="log-out" onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Profile;
