import React, { Fragment, useEffect } from 'react'
import { fetchResturants } from '../apis/restaurants'

export const Restaurants = () => {

  useEffect(() => {
    fetchResturants()
    .then((data) =>
      console.log(data)
    )
  }, [])

  return (
    <Fragment>
      レストラン一覧
    </Fragment>
  )
}

