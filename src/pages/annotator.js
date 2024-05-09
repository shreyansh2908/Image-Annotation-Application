import React, { useState, useRef } from 'react';
import Annotation from 'react-image-annotation';
import image1 from "./image1.png";
import UploadFile from './UploadFile';

const Annotator = ({imageFiles, setImageFiles, previewImages, setPreviewImages}) => {
    const [annotation, setAnnotation] = useState({});
    const [annotations, setAnnotations] = useState([]);
    const [selectedImage, setSelectedImage] =useState(image1);
    const undoStackRef = useRef([]);
    const redoStackRef = useRef([]);

    const Box = ({ children, geometry, style }) => (
        <div
          style={{
            ...style,
            position: 'absolute',
            left: `${geometry.x}%`,
            top: `${geometry.y}%`,
            height: `${geometry.height}%`,
            width: `${geometry.width}%`,
          }}
        >
          {children}
        </div>
      )
    
      function renderSelector({ annotation }) {
        const { geometry } = annotation;
        if (!geometry) return null
    
        return (
          <Box
            geometry={geometry}
            style={{
              border: `solid 2px #E10000`
            }}
          />
        )
      }
    
      function renderHighlight({ annotation }) {
        const { geometry, data } = annotation;
        if (!geometry || !data) return null;
    
        const borderColor = data.selectedOption === 'Other' ? '#FFA500' : (Math.floor(geometry.height) % 2 !== 0 ? '#E10000' : '#0024E1');
    
        return (
          <Box
            key={annotation.data.id}
            geometry={geometry}
            style={{
              border: `solid 3px ${borderColor}`,
            }}
          />
        )
    }
    
    function renderContent({ annotation }) {
        const { geometry, data } = annotation;
        if (!geometry || !data) return null;
    
        const backgroundColor = data.selectedOption === 'Other' ? '#FFA500' : (Math.floor(geometry.height) % 2 !== 0 ? '#C60606' : '#0653C6');
    
        return (
          <div
            key={data.id}
            style={{
              background: backgroundColor,
              color: 'white',
              paddingRight: 10,
              paddingLeft: 10,
              fontWeight: "bolder",
              fontSize: 15,
              position: 'absolute',
              left: `${geometry.x}%`,
              top: `${geometry.y - 9}%`
            }}
          >
            {data.text}
          </div>
        )
    }
    
    function renderEditor(props) {
        if (!props.annotation || !props.annotation.geometry) return null;
      
        const data = props.annotation.data || {};  // Ensure data is an object even if it's not provided.
        const options = ['Option 1', 'Option 2', 'Option 3', 'Other'];
      
        return (
          <div
            style={{
              background: 'white',
              borderRadius: 3,
              position: 'absolute',
              left: `${props.annotation.geometry.x}%`,
              top: `${props.annotation.geometry.y + props.annotation.geometry.height}%`,
            }}
            className="p-2 rounded-[10px] mt-[5px]"
          >
            <select
              onChange={(e) => {
                props.onChange({
                  ...props.annotation,
                  data: {
                    ...data,
                    selectedOption: e.target.value,
                    text: e.target.value === 'Other' ? '' : data.text
                  }
                });
              }}
              value={data.selectedOption || ''}
              className="block mt-1 p-2 focus:outline-none"
            >
              {options.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
            {data.selectedOption === 'Other' && (
              <input
                onChange={(e) => props.onChange({
                  ...props.annotation,
                  data: {
                    ...data,
                    text: e.target.value
                  }
                })}
                value={data.text || ''}
                placeholder="write a description"
                className="block mt-1 p-2 focus:outline-none"
              />
            )}
            <button onClick={props.onSubmit} className="text-[#fff] bg-[#4ca3dd] py-[2px] px-2 rounded-[5px] m-2">Comment</button>
          </div>
        );
    }

    function on_Change(newAnnotation) {
        setAnnotation(newAnnotation);  // Update local state with new annotation
    }
    
    function on_Submit(newAnnotation) {
        console.log('Submitting annotation:', newAnnotation);
        const { geometry } = newAnnotation;
        let { data } = newAnnotation;
    
        // Ensuring data is not undefined and initializing if necessary
        if (!data) {
            data = { selectedOption: '', text: '' };
        }
    
        // Additional check to handle possible issues if selectedOption is undefined
        if (!data.selectedOption) {
            console.error('No selectedOption found, defaulting to empty string');
            data.selectedOption = '';  // Default to an empty string or appropriate default value
        }
    
        redoStackRef.current = [];
        setAnnotation({});  // Reset current annotation
    
        const newAnnotationData = {
            geometry,
            data: {
                ...data,
                id: Math.random(),
                imageId: selectedImage,
                selectedOption: data.selectedOption || 'default',  // Ensure selectedOption is initialized
            },
        };
    
        const newAnnotations = [...annotations, newAnnotationData];
        setAnnotations(newAnnotations);
        undoStackRef.current.push(annotations);
    
        console.log('Annotations after update:', newAnnotations);
        //forceUpdate(); // Force a re-render
    }

    const handle_Image_Selection = (index) =>{
        setSelectedImage(previewImages[index]);
    };

    const handle_undo = () => {
        if(undoStackRef.current.length > 0){
            const lastAnnotation = undoStackRef.current.pop();
            redoStackRef.current.push([...annotations]);
            setAnnotations(lastAnnotation);
        }
    };

    const handle_redo = () => {
        if(redoStackRef.current.length > 0){
            const nextAnnotation = redoStackRef.current.pop();
            undoStackRef.current.push([...annotations]);
            setAnnotations(nextAnnotation);
        }
    };

    const applyAnnotationsToNewImage = (previousAnnotations) => {
        return previousAnnotations.map(anno => ( {
            geometry: anno.geometry,
            data: {
                ...anno.data,
                id: Math.random(),
                imageId: selectedImage,
            }
        }))
    };

    const applyAnnotationsToSelectedImage = () => {
        const annotationsForNewImage = applyAnnotationsToNewImage(annotations)
        setAnnotations([...annotations,...annotationsForNewImage])
    }

    const style = {
        button: 'text-[#fff] bg-[#4ca3dd] py-[2px] px-2 rounded-[5px]'
    }

    return (
        <div className='px-4'>
            <div className='flex flex-wrap items-start gap-4 justify-evenly'>
                <div>
                    <UploadFile 
                        imageFiles={imageFiles}
                        setImageFiles={setImageFiles}
                        previewImages={previewImages}
                        setPreviewImages={setPreviewImages}
                    />
                </div>
                <div className='mt-6'>
                    <p className='text-center text-[20px] font-[600]'>Annotate Images</p>
                    <div className="flex gap-4 justify-center items-center my-4">
                        <button className={style.button} onClick={handle_undo} type="button">Undo</button>
                        <button className={style.button} onClick={handle_redo} type="button">Redo</button>
                        <button className={style.button} onClick={applyAnnotationsToSelectedImage} type="button">Apply all</button>
                    </div>
                    <div className='w-full md:w-[400px] m-auto cursor-crosshair'>
                        <Annotation 
                        src={selectedImage}
                        alt='Annotate Image'
                        annotations={annotations.filter((anno) => anno.data.imageId === selectedImage)}
                        value={annotation}
                        className='h-[300px]'
                        type={annotation.type}
                        onChange={on_Change}
                        onSubmit={on_Submit}
                        allowTouch
                        renderSelector={renderSelector}
                        renderHighlight={renderHighlight}
                        renderContent={renderContent}
                        renderEditor={renderEditor}
                        />
                    </div>

                    <div className='mt-[4%] flex flex-wrap gap-4 items-center justify-center mb-'>
                        {imageFiles.map((file, index) =>(
                            <div key={index} className='h-[70px]'>
                                <img src={previewImages[index]} 
                                alt={file.name}
                                onClick={() => handle_Image_Selection(index)}
                                className='w-[100px] h-full cursor-pointer'/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Annotator;
