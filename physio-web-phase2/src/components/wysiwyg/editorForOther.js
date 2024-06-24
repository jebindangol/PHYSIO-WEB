"use client";
import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { useRef } from "react";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");
    
    const DynamicReactQuill = ({ forwardedRef, ...props }) => (
      <RQ ref={forwardedRef} {...props} />
    );

    DynamicReactQuill.displayName = 'DynamicReactQuill'; 

    return DynamicReactQuill;
  },
  { ssr: false }
);


const QuillEditorForOthers = ({ value, onChange }) => {
  const quilRef = useRef(null);

  const handleChange = async (content) => {
    let updatedContent = content;
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    // const images = doc.querySelectorAll("img");

    // for (const img of images) {
    //   const src = img.getAttribute("src");
    //   if (src && src.startsWith("data:image")) {
    //     const blob = await fetch(src).then((res) => res.blob());
    //     const file = new File([blob], `image-${new Date().getTime()}.jpg`, {
    //       type: blob.type,
    //     });

    //     try {
    //       const response = await sendBlogsContentImages(file);
    //       if (response) {
    //         const imageUrl = API_getImage(response);
    //         img.setAttribute("src", imageUrl);
    //       } else {
    //         console.error("Unexpected response structure:", response);
    //       }
    //     } catch (error) {
    //       console.error("Error uploading image:", error);
    //     }
    //   }
    // }

    updatedContent = doc.body.innerHTML;
    // console.log("Content change: ", updatedContent);
    onChange(updatedContent);
  };

  return (
    <>
      <ReactQuill
        forwardedRef={quilRef}
        value={value}
        onChange={handleChange}
        theme="snow"
        modules={{
          toolbar: {
            container: [
              [{ header: "1" }, { header: "2" }, { font: [] }],
              [{ size: ["small", false, "large", "huge"] }],
              [{ list: "ordered" }, { list: "bullet" }],
              ["bold", "italic", "underline", "strike"],
              [{ color: [] }, { background: [] }],
              [{ align: [] }],
              ["link", "image", "video"],
              ["clean"],
            ],
          },
        }}
        formats={[
          "header",
          "font",
          "size",
          "bold",
          "italic",
          "underline",
          "strike",
          "blockquote",
          "list",
          "bullet",
          "indent",
          "color",
          "background",
          "align",
          "link",
          "image",
          "video",
        ]}
        className="h-[50vh] bg-white"
      />
    </>
  );
};

export default QuillEditorForOthers;
