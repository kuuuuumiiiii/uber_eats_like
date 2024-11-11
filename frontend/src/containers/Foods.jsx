import React from 'react';
import { useParams } from 'react-router-dom';

export const Foods = () => {
  // useParamsフックを使用して、URLパラメータを取得
  const { restaurantsId } = useParams();

  return (
    <div>
      <h1>フード一覧</h1>
      <p>restaurantsIdは {restaurantsId} です</p>
    </div>
  );
}