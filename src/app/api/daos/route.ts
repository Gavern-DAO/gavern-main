import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { daosApi } from "@/lib/api";

// Cache duration: 30 minutes in milliseconds
const CACHE_DURATION = 30 * 60 * 1000;
// Path for the cache file in a temporary directory
const CACHE_FILE_PATH = path.join("/tmp", "all-daos.json");

export async function GET(): Promise<
  | NextResponse<{ pubkey: string; owner: string; name: string }[]>
  | NextResponse<{ message: string }>
> {
    try {
        // Check if the cache file exists
        await fs.access(CACHE_FILE_PATH);

        // If it exists, check if it's still valid
        const stats = await fs.stat(CACHE_FILE_PATH);
        const fileAge = Date.now() - stats.mtime.getTime();

        if (fileAge < CACHE_DURATION) {
            // Cache is valid, read and return the file
            const fileContents = await fs.readFile(CACHE_FILE_PATH, "utf8");
            const data = JSON.parse(fileContents);
            return NextResponse.json(data);
        }
    } catch (error) {
        // An error here likely means the file doesn't exist, so we'll proceed to fetch it.
        // We can ignore the error and continue.
    }

  // If cache is invalid or doesn't exist, fetch new data
  try {
    const newData: {
      pubkey: string;
      owner: string;
      name: string;
    }[] = await daosApi.getAllDaos();

    // Write the new data to the cache file
    await fs.writeFile(CACHE_FILE_PATH, JSON.stringify(newData, null, 2));

    // Return the new data
    return NextResponse.json(newData);
  } catch (fetchError) {
    console.error("Failed to fetch new DAO data:", fetchError);
    return NextResponse.json(
      { message: "Failed to fetch DAO data from external API" },
      { status: 502 }
    );
  }
}
