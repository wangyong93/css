import { urlToList } from '../_utils/pathTools';
import { getFlatMenuKeys, getMenuMatchKeys } from './SiderMenu';

const menu = [
  {
    path: '/userinfo',
    children: [
      {
        path: '/userinfo/:id',
        children: [
          {
            path: '/userinfo/:id/info',
          },
        ],
      },
    ],
  },
];

const flatMenuKeys = getFlatMenuKeys(menu);




  it('Parameter path', () => {
    expect(getMenuMatchKeys(flatMenuKeys, urlToList('/userinfo/2144'))).toEqual([
      '/userinfo',
      '/userinfo/:id',
    ]);
  });

  it('three parameter path', () => {
    expect(getMenuMatchKeys(flatMenuKeys, urlToList('/userinfo/2144/info'))).toEqual([
      '/userinfo',
      '/userinfo/:id',
      '/userinfo/:id/info',
    ]);
  });
});
