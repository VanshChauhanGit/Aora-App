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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, message: "Invalid email address!" };
    }

    // Check if user already exists with email
    const existingUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("email", email)]
    );

    if (existingUser.documents.length > 0) {
      return {
        success: false,
        message: "User already exists with this email!",
      };
    }

    // Check if username already exists
    const existingUsername = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("username", username)]
    );

    if (existingUsername.documents.length > 0) {
      return { success: false, message: "Username is already taken!" };
    }

    // Create a new account in Appwrite
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) {
      return { success: false, message: "Failed to create account!" };
    }

    // Generate an avatar
    const avatarUrl = avatars.getInitials(username);

    // Save user details in the database
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

    // Sign in the user after account creation
    const signInResponse = await SignIn(email, password);

    if (!signInResponse.success) {
      return {
        success: false,
        message:
          "Account created, but failed to log in. Try logging in manually.",
      };
    }

    return {
      success: true,
      message: "User created and logged in successfully!",
      user: newUser,
    };
  } catch (error) {
    let message = "An error occurred";

    if (error.message.includes("Invalid `password` param")) {
      message = "Password must be at least 8 characters long!";
    } else if (error.message.includes("Invalid email")) {
      message = "Invalid email address!";
    } else if (error.message.includes("already exists")) {
      message = "User already exists!";
    }

    return { success: false, message };
  }
};

export const SignIn = async (email, password) => {
  if (!email || !password) {
    return { success: false, message: "Please fill all fields!" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, message: "Invalid email address!" };
  }

  try {
    const session = await account.createEmailPasswordSession(email, password);

    // Fetch current user to ensure session is active
    const currentUser = await account.get();

    return { success: true, session, user: currentUser };
  } catch (error) {
    let message = "An error occurred";

    if (error.message.includes("Invalid credentials")) {
      message = "Incorrect email or password!";
    } else if (error.message.includes("Invalid `password` param")) {
      message = "Password must be at least 8 characters long!";
    }

    return { success: false, message };
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
      config.videoCollectionId,
      [Query.orderDesc("$createdAt")]
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

export const followUser = async (currentUserId, targetUserId) => {
  try {
    // Fetch current user data
    const currentUser = await databases.getDocument(
      config.databaseId,
      config.userCollectionId,
      currentUserId
    );

    // Fetch target user data (the user being followed)
    const targetUser = await databases.getDocument(
      config.databaseId,
      config.userCollectionId,
      targetUserId
    );

    // Check if already following
    if (currentUser.followings.includes(targetUserId)) {
      console.log("Already following this user");
      return { success: false, message: "Already following this user" };
    }

    // Update current user's followings
    await databases.updateDocument(
      config.databaseId,
      config.userCollectionId,
      currentUserId,
      {
        followings: [...currentUser.followings, targetUserId],
      }
    );

    // Update target user's followers
    await databases.updateDocument(
      config.databaseId,
      config.userCollectionId,
      targetUserId,
      {
        followers: [...targetUser.followers, currentUserId],
      }
    );

    return { success: true, message: "Followed successfully" };
  } catch (error) {
    console.error("Error following user:", error);
    return { success: false, message: "Failed to follow user" };
  }
};

export const unfollowUser = async (currentUserId, targetUserId) => {
  try {
    // Fetch current user data
    const currentUser = await databases.getDocument(
      config.databaseId,
      config.userCollectionId,
      currentUserId
    );

    // Fetch target user data (the user being unfollowed)
    const targetUser = await databases.getDocument(
      config.databaseId,
      config.userCollectionId,
      targetUserId
    );

    // Check if already not following
    if (!currentUser.followings.includes(targetUserId)) {
      console.log("Not following this user");
      return { success: false, message: "Not following this user" };
    }

    // Update current user's followings
    await databases.updateDocument(
      config.databaseId,
      config.userCollectionId,
      currentUserId,
      {
        followings: currentUser.followings.filter((id) => id !== targetUserId),
      }
    );

    // Update target user's followers
    await databases.updateDocument(
      config.databaseId,
      config.userCollectionId,
      targetUserId,
      {
        followers: targetUser.followers.filter((id) => id !== currentUserId),
      }
    );

    return { success: true, message: "Unfollowed successfully" };
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return { success: false, message: "Failed to unfollow user" };
  }
};

export const getFollowers = async (userId) => {
  try {
    const user = await databases.getDocument(
      config.databaseId,
      config.userCollectionId,
      userId
    );
    return user.followers;
  } catch (error) {
    console.error("Error fetching followers:", error);
    return [];
  }
};

export const getFollowing = async (userId) => {
  try {
    const user = await databases.getDocument(
      config.databaseId,
      config.userCollectionId,
      userId
    );
    return user.followings;
  } catch (error) {
    console.error("Error fetching followings:", error);
    return [];
  }
};

export const isFollowingUser = async (currentUserId, targetUserId) => {
  try {
    const currentUser = await databases.getDocument(
      config.databaseId,
      config.userCollectionId,
      currentUserId
    );

    return currentUser.followings.includes(targetUserId);
  } catch (error) {
    console.error("Error checking follow status:", error);
    return false;
  }
};
