import { useState, FormEvent, FC, useEffect } from 'react';
import { Button } from './components/ui/button';
import { Input } from '@/components/ui/input';
import {
  doc,
  setDoc,
  updateDoc,
  DocumentReference,
  DocumentData,
  arrayUnion,
  collection,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from './components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { useAuth } from './context/auth-provider';
import { data } from './fire-basesetting';
import { Label } from './components/ui/label';
import { toast } from 'sonner';
import { User } from './context/auth-provider';

type LobbyProps = {
  setLobbyName: (name: string) => void;
};

export const Lobby = ({ setLobbyName }: LobbyProps) => {
  const [roomName, setRoomName] = useState<string>('');
  setLobbyName(roomName);
  return (
    <div>
      <div className='mt-5 flex h-fit justify-center gap-5'>
        <CreateRoomDialog setRoomName={setRoomName} />
        <JoinRoomDialog setRoomName={setRoomName} />
      </div>
      <div className='ml-16 mt-[20px] flex w-full flex-col justify-center gap-3'>
        <RoomInfromation roomName={roomName} />
        <Button variant={'outline'} className='w-fit'>
          Leave-Room
        </Button>
      </div>
    </div>
  );
};

const CreateRoomDialog: FC<JoinRoomDialogProps> = ({ setRoomName }) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const createRoom = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (name === '') return;
    if (password === '') return;

    const grouChatRef = doc(data, 'groups', name);
    const groupDataRef = doc(data, name, 'data');

    const groupData = {
      id: name,
      name,
      passwordHash: password,
      users: [user!.id],
    };
    try {
      await setDoc(grouChatRef, groupData);
      await setDoc(groupDataRef, {
        playerPosition: {
          KingPosition: { x: 7, y: 4 },
          QueenPosition: { x: 7, y: 3 },
          RookPosition: { x: 7, y: 0 },
        },
      });
      setRoomName(name);
      toast.success('Group Created');
    } catch (error) {
      toast.error('Something went wrong');
    }
    setName('');
    setPassword('');
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline'>Create Room</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Room</DialogTitle>
          <DialogDescription>Enter your room details.</DialogDescription>
        </DialogHeader>
        <form onSubmit={createRoom} className='grid gap-8'>
          <Label htmlFor='room-name' className='grid gap-2'>
            Name:
            <Input
              id='room-name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Room name'
              required
            />
          </Label>
          <Label htmlFor='room-password' className='grid gap-2'>
            Password:
            <Input
              id='room-password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Password'
              required
            />
          </Label>
          <DialogClose className='mt-2 w-fit'>
            <Button type='submit'>Create</Button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
};

type GroupMember = {
  id: string;
};
type Group = {
  id: string;
  name: string;
  passwordHash: string;
  users: GroupMember[];
};
interface JoinRoomDialogProps {
  setRoomName: (name: string) => void;
}
const JoinRoomDialog: FC<JoinRoomDialogProps> = ({ setRoomName }) => {
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { user } = useAuth();

  const joinRoom = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const groupChatRef = doc(data, 'groups', name);

      onSnapshot(groupChatRef, (groupSnap) => {
        if (!groupSnap.exists()) {
          toast.error('Invalid group name or password');

          return;
        }

        const group = groupSnap.data() as Group;

        if (group.passwordHash !== password) {
          toast.error('Invalid group name or password');

          return;
        }

        if (user && group.users.some((groupUser) => groupUser === user.id)) {
          setRoomName(name);
          toast.success('Reconnected');

          return;
        }

        if (group.users.length === 2) {
          toast.error('Room is packed');
          return;
        }
        addUserToGroup(groupChatRef);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const addUserToGroup = (
    grouChatRef: DocumentReference<DocumentData, DocumentData>,
  ) => {
    try {
      updateDoc(grouChatRef, {
        users: arrayUnion(user!.id),
      });
      setRoomName(name);
      toast.success('Room Joined');
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline'>Join Room</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Room</DialogTitle>
          <DialogDescription>Enter your room details.</DialogDescription>
        </DialogHeader>
        <form onSubmit={joinRoom} className='grid gap-8'>
          <Label htmlFor='room-name' className='grid gap-2'>
            Name:
            <Input
              id='room-name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Room name'
              required
            />
          </Label>
          <Label htmlFor='room-password' className='grid gap-2'>
            Password:
            <Input
              id='room-password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Password'
              required
            />
          </Label>
          <DialogClose className='mt-2 w-fit'>
            <Button type='submit'>Join</Button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
};
interface MyComponentProps {
  roomName: string;
}

const RoomInfromation: FC<MyComponentProps> = ({ roomName }) => {
  const [matchedUsers, setMatchedUsers] = useState<User[]>();
  console.log(matchedUsers);
  useEffect(() => {
    async function fetchData() {
      try {
        const groupRef = doc(data, 'groups', roomName);

        onSnapshot(
          groupRef,
          async (groupSnap) => {
            if (!groupSnap.exists()) {
              console.error('Group does not exist.');

              return null;
            }

            const group = groupSnap.data() as Group;

            const userCollectionRef = collection(data, 'users');

            const userQuery = query(
              userCollectionRef,
              where('id', 'in', group.users),
            );
            onSnapshot(
              userQuery,
              (userSnapshot) => {
                const fetchedUsers: User[] = userSnapshot.docs.map(
                  (doc) => doc.data() as User,
                );

                if (fetchedUsers.length === 0) {
                  console.log('No users found in the group.');

                  return;
                }

                setMatchedUsers(fetchedUsers);
                console.log(matchedUsers);
              },
              (error) => {
                console.error('Error fetching users in group:', error);
              },
            );
          },
          (error) => {
            console.error('Error fetching group document:', error);
          },
        );
      } catch (error) {
        console.error('Error fetching users in group:', error);
      }
    }
    fetchData();
  }, [roomName]);

  return (
    <Card className='w-[75%]'>
      <CardHeader>
        <CardTitle>Room details</CardTitle>
        <CardDescription>Room Name -{roomName} </CardDescription>
      </CardHeader>
      <CardContent>
        <h1 className='text-xl font-bold'>Lobby-Members:</h1>
      </CardContent>
      <CardContent className='flex gap-[30%] small:gap-[40%]'>
        {Array.isArray(matchedUsers) && matchedUsers.length > 0 ? (
          matchedUsers.map((user) => (
            <div key={user.id} className='flex flex-col items-center'>
              <p className='w-max'>{user.name}</p>
              <img src={user.image || 'error'} className='h-20 rounded-full' />
            </div>
          ))
        ) : (
          <p>No users found in this room.</p>
        )}
      </CardContent>
    </Card>
  );
};
