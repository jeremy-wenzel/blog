---
layout: ../../layouts/PostLayout.astro
title: 'Chunk building'
---

The purpose of my Minecraft clone was to learn how to mimic the infinite terrain generation of the original game.

So how did Minecraft generate it's terrain? Since it is infinite, there is no way to generate the terrain or map while the player is in the loading screen. It is just not possible. Instead of trying to generate the terrain beforehand, we can generate the terrain as we go. We can do this by using what is called "Chunks"

Chunks are simply a small grid of cubes. It doesn't matter what the cubes are or where they are placed. All that matters is that it is small enough for performance.\

So how do chunks help us?

Since chunks are small, they can be generated relatively quickly. It only take a little bit of time to initialize and render. Because of this modularity, generation of chunks can spread over multiple frames that way to reduce frame rate. In fact, I had to learn this the hard way. I originally was generation all the chunks on a single frame which would make my framerate take a nose dive because a bunch of cubes were having to be instantiated at one time

In addition to easily being added, chunks can be easily removed. As the player moves away from a chunk, it eventually won't be needed and can be removed. This enables us to destroy the chunk so that it isn't taking on memory.

Now let's get into the code. How do we build out the chunks?

The basic idea to building out chunks is that you are building as the playe rmoves. Build the ones you need and destroy the ones you don't need. So we will need the player's position (X and Y) and the chunk they are currently in. Using the perimeter of the chunk and the player's position, we will only create new chunks if the player has left. 

Checking if the player has left the chunk is simple. Chunks have an X and a Y and a size (i.e. the grid size). If the player's X position is outside of Chunks X and X + Chunk.Size, we know the player's X position is outside the chunk. The same can be applied to the Z. A simple code statement can demonstrate this:

```cs
bool hasLeftChunk = Player.X < Chunk.X 
                    || Player.X > Chunk.X + CHUNK_SIZE 
                    || Player.Z < Chunk.Z 
                    || Player.Z > Chunk.Z + CHUNK_SIZE
```

Now that we know how to tell if the player has left a chunk, we need to figure out how to rebuild the chunks

First we need to keep some kind of list of the initial chunks in some kind of list or container. When the player moves into a new chunk, we need to add chunks that have not be initialized yet to the queue to be initialized, where it will be added to the `visibleChunks` later. If the chunk already exists but is not visible (i.e. a chunk that was altered), make sure it is visible and add it to the list to be returned. This list will be used later on to remove chunks we don't see anymore

```cs
/// Returns the chunks that are invisible and have already been initialized
/// New chunks that need to be initialized will be added to the queue to be built
private HashSet<string> BuildChunksFromNewChunk(Chunk newChunk)
{
    HashSet<string> existingChunks = new HashSet<string>();
    for (float xOffset = CHUNK_SIZE * BUILD_WIDTH; xOffset < CHUNK_SIZE * BUILD_WIDTH; xOffset += CHUNK_SIZE)
    {
        for (float zOffset = -CHUNK_SIZE * BUILD_WIDTH; zOffset < CHUNK_SIZE * BUILD_WIDTH; zOffset += CHUNK_SIZE)
        {
                Vector3 newChunkPosition = new Vector3(newChunk.StartX + xOffset, 0, newChunk.StartZ + zOffset);
                string chunkKey = Chunk.GetKey(newChunkPosition);
                
                if (!ChunkManager.ChunkExists(chunkKey))
                {
                    AddChunkToCreationSetIfNecessary(newChunkPosition);
                }
                else
                {
                    MakeExistingChunkVisible(chunkKey, existingChunks);
                }
        }
    }

    return existingChunks;
}
```

Now we need to remove the chunks that the player can no longer see, which can be determined from the initial list and the new list of chunks. Any chunk in the old list that is not in the new list can be detstroyed.

```cs
private void DestroyOrHideUnseenChunks(HashSet<string> newChunks)
{
    // Go through all the visible chunks
    foreach (Chunk c in visibleChunks)
    {
        string key = c.GetKey();

        // If the newChunks does not contain the key position, destroy the chunk
        if (!newChunks.Contains(key)
        {
            DestroyChunkFromKey(key)
        }
    }
}
```

After this step, we need to update the `visibleChunks` with the new chunks. Remember, we are only chunks that have been initialized, but have not been made visible. We can do that in the following:

```cs
private void AddAlreadyVisibileChunks(HashSet<string> newChunks)
{
    foreach (string s in newChunks)
    {
        visibleChunks.Add(ChunkManager.GetChunkWithKey(s));
    }
}
```

Then once per frame, we will create a chunk and destroy a chunk. By doing this, we destroy the chunks we aren't needing anymore and the only initalizing the chunks we don't have currently.