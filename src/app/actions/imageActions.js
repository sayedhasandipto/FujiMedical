"use server";

// Uploads an image file to ImgBB (free image hosting, no credit card needed)
// and returns the direct image URL. Runs on the server, so no CORS issues
// and the API key stays hidden from the browser.
export async function uploadImageToImgbb(formData) {
  try {
    const file = formData.get("image");

    if (!file || typeof file === "string") {
      return { success: false, error: "No image file provided" };
    }

    if (!process.env.IMGBB_API_KEY) {
      return {
        success: false,
        error: "IMGBB_API_KEY is not set in .env",
      };
    }

    const imgbbForm = new FormData();
    imgbbForm.append("image", file);

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
      {
        method: "POST",
        body: imgbbForm,
      },
    );

    const data = await res.json();

    if (!data.success) {
      return {
        success: false,
        error: data.error?.message || "Image upload to ImgBB failed",
      };
    }

    return {
      success: true,
      url: data.data.url, // direct image URL, save this in Firebase
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
