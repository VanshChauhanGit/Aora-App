import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.aora.app",
  projectId: "67b067a30029ed93c9d2",
  databaseId: "67b069810036dc2cb64a",
  userCollectionId: "67b069c9001008000125",
  videoCollectionId: "67b069fa0007af56baff",
  storageId: "67b0aa99001d1487a61e",
};

const client = new Client();

client
  .setEndpoint(config.endpoint) // Your API Endpoint
  .setProject(config.projectId) // Your project ID
  .setPlatform(config.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (email, password, username) => {
  try {
    if (!email || !password || !username) {
      return { success: false, message: "Please fill all fields!" };
    }

    // Check if the email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, message: "Invalid email address!" };
    }

    // Check if the user already exists with email
    const existingUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("email", email)]
    );

    if (existingUser.documents.length > 0) {
      return { success: false, message: "User already exists with the email!" };
    }

    // Check if the username already exists
    const existingUsername = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("username", username)]
    );

    if (existingUsername.documents.length > 0) {
      return {
        success: false,
        message: "Username already exists with the username!",
      };
    }

    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) {
      return { success: false, message: "Failed to create account!" };
    }

    const avatarUrl = avatars.getInitials(username);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        username,
        email,
        avatar: avatarUrl,
      }
    );
    await SignIn(email, password);

    return {
      success: true,
      message: "User created successfully!",
      user: newUser,
    };
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

export const SignIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
};

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId
    );
    return posts.documents;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.orderDesc("$createdAt", Query.limit(7))]
    );
    return posts.documents;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const searchPosts = async (query) => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.search("title", query)]
    );
    return posts.documents;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const getUserPosts = async (userId) => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.equal("creator", userId)]
    );
    return posts.documents;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");
    console.log(session);
    return session;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const getFilePreview = async (fileId, type) => {
  let fileUrl;

  try {
    if (type === "image") {
      fileUrl = storage.getFilePreview(
        config.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else if (type === "video") {
      fileUrl = storage.getFileView(config.storageId, fileId);
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error("Failed to get file preview");

    return fileUrl;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const uploadFile = async (file, type) => {
  if (!file) return;

  const { mimeType, ...rest } = file;
  const asset = { type: mimeType, ...rest };

  try {
    const uploadedFile = await storage.createFile(
      config.storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);

    return fileUrl;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const createPost = async (form) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      config.databaseId,
      config.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    );

    return newPost;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const getUserBookmarkSavedPosts = async (userId) => {
  try {
    // Fetch all videos (pagination recommended for large data)
    const response = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId
    );

    // Filter videos where the saved array contains the user
    const savedVideos = response.documents.filter((video) =>
      video.saved?.some((savedUser) => savedUser.$id === userId)
    );

    return savedVideos;
  } catch (error) {
    console.error("Error fetching saved posts:", error);
    throw new Error(error.message);
  }
};

export const savePostToBookmark = async (postId, userId) => {
  try {
    // Get the current post data
    const post = await databases.getDocument(
      config.databaseId,
      config.videoCollectionId,
      postId
    );

    // Ensure `saved` is an array (or initialize it as an empty array)
    const savedUsers = Array.isArray(post.saved) ? post.saved : [];

    // Add user ID only if not already present
    if (!savedUsers.includes(userId)) {
      savedUsers.push(userId);
    }

    // Update the document in Appwrite
    const updatedPost = await databases.updateDocument(
      config.databaseId,
      config.videoCollectionId,
      postId,
      { saved: savedUsers }
    );

    return updatedPost;
  } catch (error) {
    console.error("Error saving post:", error);
    throw new Error(error.message);
  }
};

export const removePostFromBookmark = async (postId, userId) => {
  try {
    const post = await databases.getDocument(
      config.databaseId,
      config.videoCollectionId,
      postId
    );

    const updatedSaved = post.saved.filter(
      (savedUser) => savedUser.$id !== userId
    );

    const updatedPost = await databases.updateDocument(
      config.databaseId,
      config.videoCollectionId,
      postId,
      { saved: updatedSaved }
    );

    return updatedPost;
  } catch (error) {
    console.error("Error removing bookmark:", error);
    throw new Error(error.message);
  }
};

export const getSameUserPostsWithoutPlayingPost = async (userId, postId) => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.equal("creator", userId), Query.notEqual("$id", postId)]
    );
    return posts.documents;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const deletePost = async (postId) => {
  try {
    const post = await databases.deleteDocument(
      config.databaseId,
      config.videoCollectionId,
      postId
    );
    return post;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
