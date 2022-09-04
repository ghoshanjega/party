import { Players } from 'interface'
import React, { Fragment } from 'react'
import Agar3D from './Agar3D'
import Cell3D from './Cell3D'


const Cells3D = ({ players }: { players: Players }) => {

  const cellsArray = Object.values(players || {}).filter(a => a != null)
  if (cellsArray.length > 0) {
    return (
      <Fragment>
        {
          cellsArray.map(player => <Cell3D player={player} key={player.id} />)
        }
      </Fragment>
    )
  }
  return <Fragment />
}

export default Cells3D
