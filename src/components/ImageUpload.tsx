import React, { useRef, useState, useEffect } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import { ref, uploadBytes } from 'firebase/storage';
import { storage } from '../config/firebase';
import { MCQ, MCQtemplate, Question, isMCQ, isFRQ, FRQtemplate, MCMQtemplate } from '../config/types';
import 'react-image-crop/dist/ReactCrop.css';
type Rect = {
    x: number;
    y: number;
    width: number;
    height: number;
};
export const ImageUpload = ({ image, setImage, addQuestion }: { image: string, setImage: any, addQuestion: any }) => {
    const [stage, setStage] = useState(0);
    const [question, setQuestion] = useState<Question>(MCQtemplate);
    const [crop, setCrop] = useState<Crop>();
    const [imageElement, setImageElement] = useState<HTMLImageElement>();
    const [drawMode, setDrawMode] = useState(false);
    const [rects, setRects] = useState<Rect[]>([]);
    const imgRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const onImageLoaded = (_: any) => {
        setCrop({
            unit: '%',
            x: 0,
            y: 0,
            width: 100,
            height: 100
        });
    }
    const cropImage = () => {
        const canvas = document.createElement('canvas');
        const img = imgRef.current;
        if (!img || !crop) return false;
        const scaleX = img.naturalWidth / (crop.unit === '%' ? 100 : img.width);
        const scaleY = img.naturalHeight / (crop.unit === '%' ? 100 : img.height);
        const ctx = canvas.getContext('2d')!;
        canvas.width = crop.width! * scaleX;
        canvas.height = crop.height! * scaleY;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(
            img,
            crop.x! * scaleX,
            crop.y! * scaleY,
            crop.width! * scaleX,
            crop.height! * scaleY,
            0,
            0,
            crop.width! * scaleX,
            crop.height! * scaleY
        );
        const dataUrl = canvas.toDataURL('image/jpeg');
        setImage(dataUrl);
        const imgElement = new Image();
        imgElement.src = dataUrl;
        imgElement.onload = () => setImageElement(imgElement);
        return true;
    };
    useEffect(() => {
        if (!imageElement) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const scaleX = canvas.width / imageElement.width;
        const scaleY = canvas.height / imageElement.height;
        const scale = Math.min(scaleX, scaleY);
        const x = (canvas.width - imageElement.width * scale) / 2;
        const y = (canvas.height - imageElement.height * scale) / 2;
        ctx.setTransform(scale, 0, 0, scale, x, y);
        ctx.drawImage(imageElement, 0, 0);
    }, [canvasRef, imageElement]);
    const draw = () => {
        if (!imageElement) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(imageElement, 0, 0);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        const scaleX = canvas.width / imageElement.width;
        const scaleY = canvas.height / imageElement.height;
        const scale = Math.min(scaleX, scaleY);
        const x = (canvas.width - imageElement.width * scale) / 2;
        const y = (canvas.height - imageElement.height * scale) / 2;
        ctx.fillStyle = 'red';
        rects.forEach((rect) => {
            ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
        });
        ctx.setTransform(scale, 0, 0, scale, x, y);
    };
    const getPos = (e: React.MouseEvent<HTMLCanvasElement>|React.TouchEvent<HTMLCanvasElement>) => {
        return {
            x: 'clientX' in e ? (e as React.MouseEvent<HTMLCanvasElement>).clientX : (e as React.TouchEvent<HTMLCanvasElement>).touches[0].clientX,
            y: 'clientY' in e ? (e as React.MouseEvent<HTMLCanvasElement>).clientY : (e as React.TouchEvent<HTMLCanvasElement>).touches[0].clientY
        };
    };
    const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>|React.TouchEvent<HTMLCanvasElement>) => {
        setDrawMode(true);
        const { x, y } = getPos(e);
        setRects(rects.concat({ x, y, width: 0, height: 0 }));
    }
    const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>|React.TouchEvent<HTMLCanvasElement>) => {
        if (!drawMode) return;
        const rect = rects[rects.length - 1];
        const { x, y } = getPos(e);
        const width = x - rect.x; 
        const height = y - rect.y;
        setRects(rects.slice(0, rects.length - 1).concat({ x: rect.x, y: rect.y, width, height }));
        draw();
    }
    const onMouseUp = () => {
        if (!drawMode) return;
        setDrawMode(false);
    }
    const uploadFile = () => {
        if(!imageElement) return false;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = imageElement.width;
        canvas.height = imageElement.height;
        ctx.drawImage(imageElement, 0, 0);
        const canvas2 = canvasRef.current!;
        const scaleX = canvas2.width / imageElement.width;
        const scaleY = canvas2.height / imageElement.height;
        const scale = Math.min(scaleX, scaleY);
        const x = (canvas2.width - imageElement.width * scale) / 2;
        const y = (canvas2.height - imageElement.height * scale) / 2;
        ctx.setTransform(1/scale, 0, 0, 1/scale, -x/scale, -y/scale);
        for(const rect of rects) {
            ctx.fillStyle = 'red';
            ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
        }
        ctx.setTransform(scale, 0, 0, scale, x, y);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setImage('');
        const upload = async () => {
            const storageRef = ref(storage, 'images/' + Date.now());
            const imgFile = await fetch(dataUrl).then((res) => res.blob());
            await uploadBytes(storageRef, imgFile);
            addQuestion({ ...question, img: storageRef.name });
        };
        upload();
        return true;
    };
    const nextStage = () => {
        if (stage === 0) {
            if (isMCQ(question)) setQuestion({ ...question, choices: Array.from({ length: 5 }, (_, i) => String.fromCharCode(65 + i)) });
            setStage(1);
        }
        if (stage === 1 && cropImage()) setStage(2);
        if (stage === 2 && uploadFile()) setStage(0);
    };
    const hasAnswer = (q: MCQ, i: number) => {
        return typeof q.answer === 'number' ? q.answer === i : (q.answer as number[]).includes(i);
    }
    const setAnswer = (i: number) => {
        if (!isMCQ(question)) return;
        const q = question as MCQ;
        if (typeof q.answer === 'number') {
            setQuestion({ ...q, answer: i });
        } else {
            const answers = q.answer as number[];
            if (answers.includes(i)) {
                setQuestion({ ...q, answer: answers.filter((a) => a !== i) });
            } else {
                setQuestion({ ...q, answer: answers.concat(i) });
            }
        }
    }
    return (
        <div className='fixed inset-0 bg-black'>
            <button className='absolute top-2 right-2 bg-gray-700 rounded-md p-2 z-50' onClick={nextStage}>Continue</button>
            { stage === 0 &&
                <div className='fixed inset-5'>
                    <img 
                        src={image} 
                        alt="preview" 
                        className="w-full h-full object-contain opacity-10"
                    />
                    <div className='fixed inset-0 flex justify-center items-center'>
                        <div className='flex flex-col gap-5 w-fit'>
                            <div className='grid grid-cols-3 gap-2'>
                                <button className={`hover:bg-gray-600 rounded-md p-2 ${isMCQ(question) && typeof (question as MCQ).answer === 'number' ? 'bg-gray-600' : 'bg-gray-700'}`} onClick={() => setQuestion(MCQtemplate)}>MCQ</button>
                                <button className={`hover:bg-gray-600 rounded-md p-2 ${isMCQ(question) && typeof (question as MCQ).answer !== 'number' ? 'bg-gray-600' : 'bg-gray-700'}`} onClick={() => setQuestion(MCMQtemplate)}>MCMQ</button>
                                <button className={`hover:bg-gray-600 rounded-md p-2 ${isFRQ(question) ? 'bg-gray-600' : 'bg-gray-700'}`} onClick={() => setQuestion(FRQtemplate)}>FRQ</button>
                            </div>
                            { isMCQ(question) &&
                                <div className='grid grid-cols-5 gap-2'>
                                    {
                                        Array.from({ length: 5 }, (_, i) => i).map((i) => (
                                            <button
                                                key={i}
                                                className={`rounded-md p-2 ${hasAnswer(question as MCQ, i) ? 'bg-green-800' : 'bg-gray-700 hover:bg-gray-600'}`}
                                                onClick={() => setAnswer(i)}
                                            >{ String.fromCharCode(65 + i) }</button>
                                        ))
                                    }
                                </div>
                            }
                            { isFRQ(question) &&
                                <textarea className='bg-gray-700 rounded-md p-2 w-full h-1/2 outline-none' placeholder='Type your answer here' onChange={(e) => setQuestion({ ...question, answer: e.target.value})}></textarea>
                            }
                            <textarea
                                className='bg-gray-700 rounded-md p-2 w-full h-1/2 outline-none'
                                placeholder='(Optional) Type your question here'
                                onInput={(e) => setQuestion({ ...question, question: e.currentTarget.value })}
                            ></textarea>
                        </div>
                    </div>
                </div>
            }
            { stage === 1 &&
                <div className='fixed inset-5 flex justify-center items-center'>
                    <ReactCrop
                        crop={crop}
                        onChange={(c) => setCrop(c)}
                        keepSelection
                    >
                        <img 
                            ref={imgRef}
                            src={image} 
                            alt="preview" 
                            onLoad={onImageLoaded}
                        />
                    </ReactCrop>
                </div>
            }
            { stage === 2 && imageElement &&
                <>
                    <canvas
                        ref={canvasRef}
                        onMouseDown={onMouseDown}
                        onTouchStart={onMouseDown}
                        onMouseMove={onMouseMove}
                        onTouchMove={onMouseMove}
                        onMouseUp={onMouseUp}
                        onTouchEnd={onMouseUp}
                        className='absolute cursor-crosshair'
                    />
                </>
            }
        </div>
    );
};
