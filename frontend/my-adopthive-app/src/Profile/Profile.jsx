import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import { FiCamera } from "react-icons/fi";

function Profile() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  function handleLogout() {
    localStorage.removeItem("user");
    setIsOpen(false);
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
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg');
        setImageUrl(imageData);
        stream.getTracks().forEach(track => track.stop());
      })
      .catch(error => {
        return ('Error taking photo:', error);
      });
  }

  return (
    <>
      {isOpen && (
        <div className="profile">
          <div>
            <label className="profile-image-upload">
              <div
                className={`profile-image ${imageUrl ? 'has-image' : ''}`}
                style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : '' }}
              >
                {!imageUrl && (
                  <div className="profile-image-placeholder">
                    <FiCamera className="camera-icon" onClick={takePhoto} />
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                capture="camera"
                onChange={handleFileInput}
                style={{ display: 'none' }}
              />
            </label>
            <p>User: {user.FirstName}</p>
            <p>Role: {user.role}</p>
            {selectedFile && !imageUrl && (
              <button onClick={handleUpload}>Upload File</button>
            )}
            <button className="log-out" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;
