import React, { useState } from 'react';
import Annotator from "./pages/annotator";

function App() {
  const [imageFiles, setImageFiles]=useState([]);
  const [previewImages, setPreviewImages]=useState([]);// preview images stores the URL of all images we are uploading from our computer

  return (
    <div className="App">
      <Annotator
        imageFiles={imageFiles}
        setImageFiles={setImageFiles}
        previewImages={previewImages}
        setPreviewImages={setPreviewImages}
      />
    </div>
  );
}

export default App;