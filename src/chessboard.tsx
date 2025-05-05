import { useState, useEffect } from 'react';
import { cn } from './lib/utils';
import {
  KingMovement,
  QueenMovement,
  RookMovement,
  HorseMovement,
  CamelMovement,
  PawnMovement,
  BlackKingMovement,
  BlackHorseMovement,
  BlackCamelMovement,
  BlackPawnMovement,
  BlackQueenMovement,
  BlackRookMovement,
} from './movement';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { data } from './fire-basesetting';
import { toast } from 'sonner';

type Piece =
  | 'king'
  | 'queen'
  | 'rook'
  | 'rook2'
  | 'horse'
  | 'horse2'
  | 'camel'
  | 'camel2'
  | 'pawn1'
  | 'pawn2'
  | 'pawn3'
  | 'pawn4'
  | 'pawn5'
  | 'pawn6'
  | 'pawn7'
  | 'pawn8'
  | 'blackKing'
  | 'blackQueen'
  | 'blackRook1'
  | 'blackRook2'
  | 'blackHorse1'
  | 'blackHorse2'
  | 'blackCamel1'
  | 'blackCamel2'
  | 'blackPawn1'
  | 'blackPawn2'
  | 'blackPawn3'
  | 'blackPawn4'
  | 'blackPawn5'
  | 'blackPawn6'
  | 'blackPawn7'
  | 'blackPawn8';

type PiecePosition = { x: number; y: number };
type BoardProps = { lobbyName: string | null };

export const Board = ({ lobbyName }: BoardProps) => {
  const initialPositions: Record<Piece, PiecePosition> = {
    king: { x: 7, y: 4 },
    queen: { x: 7, y: 3 },
    rook: { x: 7, y: 0 },
    rook2: { x: 7, y: 7 },
    horse: { x: 7, y: 1 },
    horse2: { x: 7, y: 6 },
    camel: { x: 7, y: 2 },
    camel2: { x: 7, y: 5 },
    pawn1: { x: 6, y: 0 },
    pawn2: { x: 6, y: 1 },
    pawn3: { x: 6, y: 2 },
    pawn4: { x: 6, y: 3 },
    pawn5: { x: 6, y: 4 },
    pawn6: { x: 6, y: 5 },
    pawn7: { x: 6, y: 6 },
    pawn8: { x: 6, y: 7 },
    blackKing: { x: 0, y: 4 },
    blackQueen: { x: 0, y: 3 },
    blackRook1: { x: 0, y: 0 },
    blackRook2: { x: 0, y: 7 },
    blackHorse1: { x: 0, y: 1 },
    blackHorse2: { x: 0, y: 6 },
    blackCamel1: { x: 0, y: 2 },
    blackCamel2: { x: 0, y: 5 },
    blackPawn1: { x: 1, y: 0 },
    blackPawn2: { x: 1, y: 1 },
    blackPawn3: { x: 1, y: 2 },
    blackPawn4: { x: 1, y: 3 },
    blackPawn5: { x: 1, y: 4 },
    blackPawn6: { x: 1, y: 5 },
    blackPawn7: { x: 1, y: 6 },
    blackPawn8: { x: 1, y: 7 },
  };

  const [piecePositions, setPiecePositions] = useState(initialPositions);
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [availableMoves, setAvailableMoves] = useState<PiecePosition[]>([]);

  const pieceMovementMap: Record<Piece, { x: number; y: number }[]> = {
    king: Object.values(KingMovement),
    queen: Object.values(QueenMovement),
    rook: Object.values(RookMovement),
    rook2: Object.values(RookMovement),
    horse: Object.values(HorseMovement),
    horse2: Object.values(HorseMovement),
    camel: Object.values(CamelMovement),
    camel2: Object.values(CamelMovement),
    pawn1: Object.values(PawnMovement),
    pawn2: Object.values(PawnMovement),
    pawn3: Object.values(PawnMovement),
    pawn4: Object.values(PawnMovement),
    pawn5: Object.values(PawnMovement),
    pawn6: Object.values(PawnMovement),
    pawn7: Object.values(PawnMovement),
    pawn8: Object.values(PawnMovement),
    blackKing: Object.values(BlackKingMovement),
    blackQueen: Object.values(BlackQueenMovement),
    blackRook1: Object.values(BlackRookMovement),
    blackRook2: Object.values(BlackRookMovement),
    blackHorse1: Object.values(BlackHorseMovement),
    blackHorse2: Object.values(BlackHorseMovement),
    blackCamel1: Object.values(BlackCamelMovement),
    blackCamel2: Object.values(BlackCamelMovement),
    blackPawn1: Object.values(BlackPawnMovement),
    blackPawn2: Object.values(BlackPawnMovement),
    blackPawn3: Object.values(BlackPawnMovement),
    blackPawn4: Object.values(BlackPawnMovement),
    blackPawn5: Object.values(BlackPawnMovement),
    blackPawn6: Object.values(BlackPawnMovement),
    blackPawn7: Object.values(BlackPawnMovement),
    blackPawn8: Object.values(BlackPawnMovement),
  };

  const handlePieceClick = (piece: Piece) => {
    if (selectedPiece === piece) {
      setSelectedPiece(null);
      setAvailableMoves([]);
    } else {
      setSelectedPiece(piece);
      const moves = pieceMovementMap[piece]
        .map((move) => ({
          x: piecePositions[piece].x + move.x,
          y: piecePositions[piece].y + move.y,
        }))
        .filter((pos) => pos.x >= 0 && pos.x < 8 && pos.y >= 0 && pos.y < 8);
      setAvailableMoves(moves);
    }
  };

  const updatePositionInDatabase = async (
    piece: Piece,
    newPosition: PiecePosition,
  ) => {
    if (!lobbyName) return;
    try {
      await updateDoc(doc(data, lobbyName, 'data'), {
        [`playerPosition.${piece}`]: newPosition,
      });
    } catch {
      toast.error(`Failed to update ${piece} position`);
    }
  };

  useEffect(() => {
    if (!lobbyName) {
      toast.error('You are not in a lobby');
      return;
    }

    const unsubscribe = onSnapshot(
      doc(data, lobbyName, 'data'),
      (groupSnap) => {
        if (!groupSnap.exists()) {
          toast.error('Lobby data not found');
          return;
        }
        const groupData = groupSnap.data().playerPosition;
        setPiecePositions((prev) => ({
          ...prev,
          ...groupData,
        }));
      },
    );

    return () => unsubscribe();
  }, [lobbyName]);

  const isPathBlocked = (
    piece: Piece,
    startPos: PiecePosition,
    endPos: PiecePosition,
  ): boolean => {
    const dx = endPos.x - startPos.x;
    const dy = endPos.y - startPos.y;

    if (dx === 0 || dy === 0) {
      const stepX = dx === 0 ? 0 : dx > 0 ? 1 : -1;
      const stepY = dy === 0 ? 0 : dy > 0 ? 1 : -1;

      let x = startPos.x + stepX;
      let y = startPos.y + stepY;

      while (x !== endPos.x || y !== endPos.y) {
        if (
          Object.values(piecePositions).some(
            (pos) => pos.x === x && pos.y === y,
          )
        ) {
          return true;
        }
        x += stepX;
        y += stepY;
      }
    }

    if (Math.abs(dx) === Math.abs(dy)) {
      const stepX = dx > 0 ? 1 : -1;
      const stepY = dy > 0 ? 1 : -1;

      let x = startPos.x + stepX;
      let y = startPos.y + stepY;

      while (x !== endPos.x || y !== endPos.y) {
        if (
          Object.values(piecePositions).some(
            (pos) => pos.x === x && pos.y === y,
          )
        ) {
          return true;
        }
        x += stepX;
        y += stepY;
      }
    }

    return false;
  };

  const handleMove = async (position: PiecePosition) => {
    if (!selectedPiece) return;

    const startPos = piecePositions[selectedPiece];
    const endPos = position;

    const blocked = isPathBlocked(selectedPiece, startPos, endPos);

    if (blocked) {
      toast.error('Move blocked by another piece');
      return;
    }

    const capturedPiece = Object.entries(piecePositions).find(
      ([piece, pos]) => pos.x === endPos.x && pos.y === endPos.y,
    );

    if (
      capturedPiece &&
      ((selectedPiece.includes('black') &&
        !capturedPiece[0].includes('black')) ||
        (!selectedPiece.includes('black') &&
          capturedPiece[0].includes('black')))
    ) {
      const captureSound = new Audio('/capture.mp3');
      captureSound.play();

      setPiecePositions((prev) => {
        const newPositions = { ...prev };
        delete newPositions[capturedPiece[0] as Piece];
        return newPositions;
      });

      await updatePositionInDatabase(capturedPiece[0] as Piece, {
        x: -1,
        y: -1,
      });
    }

    setPiecePositions((prev) => ({
      ...prev,
      [selectedPiece]: endPos,
    }));

    await updatePositionInDatabase(selectedPiece, endPos);
    setAvailableMoves([]);
  };

  return (
    <div className='h-fit border-4 border-gray-700'>
      {Array.from({ length: 8 }).map((_, rowIndex) => (
        <div key={rowIndex} className='flex'>
          {Array.from({ length: 8 }).map((_, cellIndex) => {
            const isWhite = (rowIndex + cellIndex) % 2 === 0;
            const isHighlighted = availableMoves.some(
              (pos) => pos.x === rowIndex && pos.y === cellIndex,
            );
            const pieceEntry = Object.entries(piecePositions).find(
              ([, pos]) => pos.x === rowIndex && pos.y === cellIndex,
            );

            return (
              <div
                key={cellIndex}
                className={cn(
                  'flex h-20 w-20 items-center justify-center border-2 border-transparent bg-gray-900 text-8xl small:h-28 small:w-28',
                  isWhite && 'bg-gray-600',
                  isHighlighted && 'border-white',
                )}
                onClick={() =>
                  isHighlighted && handleMove({ x: rowIndex, y: cellIndex })
                }
              >
                {pieceEntry ? (
                  <button
                    onClick={() => handlePieceClick(pieceEntry[0] as Piece)}
                    className={cn(
                      pieceEntry[0].includes('black')
                        ? 'text-black'
                        : 'text-white',
                    )}
                  >
                    {pieceEntry[0] === 'king'
                      ? '♔'
                      : pieceEntry[0] === 'queen'
                        ? '♕'
                        : pieceEntry[0].includes('rook')
                          ? '♖'
                          : pieceEntry[0].includes('horse')
                            ? '♘'
                            : pieceEntry[0].includes('camel')
                              ? '♗'
                              : pieceEntry[0] === 'blackKing'
                                ? '♚'
                                : pieceEntry[0] === 'blackQueen'
                                  ? '♛'
                                  : pieceEntry[0].includes('blackRook')
                                    ? '♜'
                                    : pieceEntry[0].includes('blackHorse')
                                      ? '♞'
                                      : pieceEntry[0].includes('blackCamel')
                                        ? '♝'
                                        : pieceEntry[0].includes('blackPawn')
                                          ? '♙'
                                          : '♙'}
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
