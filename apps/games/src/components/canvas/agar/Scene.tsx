import { emitControl, joinGame, setupListners } from '@/helpers/socket';
import { useStore } from '@/helpers/store';
import { Physics } from '@react-three/cannon';
import { Stats } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { C, Game, Player } from 'interface';
import { button, useControls } from 'leva';
import { AppProps } from 'next/app';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Agars3D from './Agars3D';
import Cell3D from './Cell3D';
import Cells3D from './Cells3D';
import { MouseMove, startCapturingInput, stopCapturingInput } from './controls';
import { calcDirection, getPlayer, calcSpeed } from './logic';
import { Rig } from './Rig';

export const Scene = ({ }) => {

  const clock = useRef(0);
  const { socket, game, joined } = useStore();
  const [sentJoin, setSentJoin] = useState(false)


  const { gl, scene, size, events, viewport } = useThree()


  // useFrame((state, delta, frame) => {
  //   if (state.clock.elapsedTime > clock.current + 1) {
  //     clock.current = state.clock.elapsedTime;
  //     // socket.emit(C.MSG_TYPES.GET_GAME_STATE);
  //     // console.log("emitted")
  //     // setupListners(socket, useStore.setState);
  //     if (!sentJoin) {
  //       // joinGame(socket, 'newGuy')
  //       // setSentJoin(true)
  //     }
  //   }
  // });

  // const [scene] = useState(() => new THREE.Scene())

  const handleMouseMove: MouseMove = (e) => {
    emitControl(socket, calcDirection(e.clientX, e.clientY), calcSpeed(e.clientX, e.clientY, viewport))
  }

  useEffect(() => {
    setupListners(socket, useStore.setState);
    joinGame(socket, 'newGuy')
    startCapturingInput(handleMouseMove)
    return () => {
      socket.off('connect')
      stopCapturingInput(handleMouseMove)
    }
  }, [])
  const player = getPlayer(game, socket.id) as Player


  const [{ }, set] = useControls(() =>
  ({
    name: { value: 'default', editable: false },
    score: { value: 0, editable: false },
    direction: { value: 0, editable: false },
    x: { value: 0, editable: false },
    y: { value: 0, editable: false },
    speed: { value: 0, editable: false },
    agarCount: { value: 0, editable: false },
    join: button(() => joinGame(socket, 'newGuy'))
  }));

  useEffect(() => {
    if (player) {
      set({
        name: player.username,
        x: player.x,
        y: player.y,
        direction: player.direction,
        score: player.score,
        speed: player.speed,
        agarCount: Object.keys(game.agars).length
      })
    }


  }, [player])


  if (game && Object.keys(game).length !== 0) {
    return <>
      <Rig game={game}>
        <Stats showPanel={0} className="stats" />
        <Physics iterations={1}>
          <Agars3D agars={game.agars} />
          <Cells3D players={game.players} />
        </Physics>
      </Rig>
    </>;
  }
  return (
    <>
      Loading
    </>
  );
};
export default Scene;
