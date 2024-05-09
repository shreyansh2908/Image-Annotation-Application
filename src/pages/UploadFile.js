import React, { useEffect, useState } from 'react';

const UploadFile = ({imageFiles, setImageFiles, previewImages, setPreviewImages}) => {
    const [isDragging, setIsDragging]=useState(false);
    const [isLoading, setIsLoading]=useState(false);

    const handleFileSelection = (selectedFile) => {
        const allowedFileTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/bmp'];
        const validFiles = Array.from(selectedFile).filter((file) =>
            allowedFileTypes.includes(file.type)
    );

    if(validFiles.length > 0){
        setIsLoading(true);
        setTimeout(()=> {
            setImageFiles(validFiles);
            const imageUrls = validFiles.map((file) => URL.createObjectURL(file)) // This URL points to file in memory
            setPreviewImages(imageUrls);
            setIsLoading(false);

        },3000)
    }
    else{
        alert("No Valid file type selected, please select png, jpg, jpeg or bmp")
    }
    };

    const handleFileChange = (event) => {
        const selectedFiles = event.target.files;
        if(selectedFiles.length>0){
            const updatedFiles = [...imageFiles, ...selectedFiles];
            handleFileSelection(updatedFiles);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files;
        if(droppedFile.length > 0){
            const updatedFile = [...imageFiles, ...droppedFile];
            handleFileSelection(updatedFile);
        }
    };

    const handle_Drag_Enter = (e) =>{
        e.preventDefault();
        setIsDragging(true);
    };
    
    const handle_Drag_Over = (e) =>{
        e.preventDefault();
        setIsDragging(true);
    };

    const handle_Drag_Leave = (e) =>{
        e.preventDefault();
        setIsDragging(false);
    };

    useEffect(() => {
        return () => {
            imageFiles.forEach((file) => URL.revokeObjectURL(file)); //important for preventing memory leaks
        };
    }, [imageFiles]);
    return(
            <div className='container'>
                <p className='upload header'>Upload Files</p>
                    <div className={ isDragging ? 'bg-gray-200' : 'upload_content'}
                        onDragEnter = { handle_Drag_Enter}
                        onDragOver = {handle_Drag_Over}
                        onDragLeave={handle_Drag_Leave}
                        onDrop={handleDrop}
                        >
                        <div>
                            {isLoading ? (<>Processing...</>): (<></>)}
                        </div>
                        <p className='information'>Drag and Drop image</p>
                            <div className='container_2'>
                                <div className='input_container'>
                                    <input
                                     type='file'
                                     id='ctl'
                                     accept='.png,.jpeg,.jpg,.bmp'
                                     multiple
                                     onChange={handleFileChange}
                                     style={{
                                        opacity: 0,
                                        position: "absolute",
                                        zindex: -1,
                                     }}
                                     >
                                     </input>
                                     <label htmlFor='ctl' className='custom_label'>Select Files</label>
                                </div>
                                <div className='input_container'>
                                    <input
                                     type='file'
                                     id='ctrl'
                                     webkitdirectory='true'
                                     directory=''
                                     className='input'
                                     onChange={handleFileChange}
                                     style={{
                                        opacity: 0,
                                        position: "absolute",
                                        zindex: -1,
                                     }}
                                     >
                                     </input>
                                     <label htmlFor='ctrl' className='custom_folder'>Select Folders</label>
                                </div>
                            </div>
                            <div className='images_container'> 
                            {imageFiles.map((file,index) => (
                                <div key={index}>
                                    <img src = {previewImages[index]} alt={file.name} className='image_preview'>

                                    </img>
                                </div>    
                            ))}
                            </div>
                    </div>
            </div>
    );
};

export default UploadFile;