'use client'

// Importing necessary dependencies
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Post from '@/components/Post';
import { Box, Button, Center, Text } from '@chakra-ui/react';
import {ChevronLeftIcon} from '@chakra-ui/icons'
// Defining the component
export default function ExampleClientComponent() {

  interface Github {
    name: string,
    repo_url: string,
    clone_url: string,
    language: string,
    description: string 
  }

  interface SketchFab {
    name: string,
    html: string
  }

  
  // Defining the Post interface
  interface Post {
    _id: string;
    classID: string;
    title: string;
    message: string;
    video_conferencing?: string;
    realworldApplication?: string;
    github: Github;
    youtubeID?: string;
    sketchfab: SketchFab
  }

  // Destructuring values from useSession hook
  const { data: session, status: sessionStatus } = useSession();
  const [posts, setPosts] = useState<Post[]>();
  const router = useRouter();
  const { id: classroom_id } = useParams();

  // Fetching data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/classroom/post?classID=${classroom_id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Redirecting to login if the user is unauthenticated
    if (sessionStatus === 'unauthenticated') {
      router.replace('/login');
    } else {
      fetchData();
    }
  }, [classroom_id, router, sessionStatus]);

  // Rendering the component
  return (
    <Box>
    <Center mt={2}>
        <Button leftIcon={<ChevronLeftIcon fontSize='25px'/>} onClick={() => {router.replace('/dashboard')}}>
            Go back
        </Button>
        <Text fontSize='3xl' fontWeight='bold' ml={4}>
            Class Feed
        </Text>
    </Center>
      {posts && (
        <ul>
          {posts.map((item) => (
            <Post
              key={item._id}
              id={item._id}
              title={item.title}
              message={item.message}
              video_conferencing={item.video_conferencing}
              githubName={item.github?.name}
              githubURL={item.github?.repo_url}
              githubCloneURL={item.github?.clone_url}
              githubLanguage={item.github?.language}
              githubDescription={item.github?.description}
              sketchfabHTML={item.sketchfab?.html}
              sketchfabTitle={item.sketchfab?.name}
              youtubeID={item.youtubeID}
              realworldApplication={item.realworldApplication}
            />
          ))}
        </ul>
      )}
    </Box>
  );
}
