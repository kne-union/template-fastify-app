<% if (includeOidc) { %>import { useEffect } from 'react';
<% } %>import RemoteLoader, { createWithRemoteLoader } from '@kne/remote-loader';
import AppChildrenRouter from '@kne/app-children-router';
import { Navigate } from 'react-router-dom';
<% if (includeOidc) { %>import { getOidcClient } from './commons/oidcClient';
<% } %>import './index.scss';
<% if (includeOidc) { %>
const Protected = ({ children }) => <RemoteLoader module="components-admin:Oidc@OidcAuthenticate">{children}</RemoteLoader>;

/** 远程组件内置的退出（useLogout）会跳到 /account/login，统一转为 OIDC 退出 */
const AccountLoginRedirect = () => {
  useEffect(() => {
    getOidcClient().logout();
  }, []);
  return null;
};
<% } else { %>
const Protected = ({ children }) => children;
<% } %>
const App = createWithRemoteLoader({
  modules: ['components-core:Global', 'components-admin:Authenticate@AfterUserLoginLayout', 'components-admin:Authenticate@AfterAdminUserLoginLayout']
})(({ remoteModules, globalPreset }) => {
  const [Global, AfterUserLoginLayout, AfterAdminUserLoginLayout] = remoteModules;
  const baseUrl = '';
  const systemName = '<%= name.charAt(0).toUpperCase() + name.slice(1) %>';<% if (includeOidc) { %>
  const isOidcClient = globalPreset.oidcMode === 'central';<% } %>

  const adminNavigation = {
    base: `${baseUrl}/admin`,
    showIndex: false,
    defaultTitle: systemName,
    list: [
      {
        key: 'user',
        title: '用户管理',
        path: `${baseUrl}/admin/user`
      },
      {
        key: 'file',
        title: '文件管理',
        path: `${baseUrl}/admin/file`
      }<% if (includeOidc) { %>,
      !isOidcClient && {
        key: 'oidc',
        title: '统一认证',
        path: `${baseUrl}/admin/oidc`
      }<% } %>
    ].filter(Boolean)
  };

  const routes = [<% if (includeOidc) { %>
    {
      path: 'oidc-interaction',
      title: 'Login',
      element: <RemoteLoader module="components-admin:Oidc@Interaction" systemName={systemName} registerUrl={`${baseUrl}/account/register`} forgetUrl={`${baseUrl}/account/forget`} />
    },
    {
      path: 'oidc-callback',
      title: 'Login',
      element: <RemoteLoader module="components-admin:Oidc@Callback" systemName={systemName} />
    },
    {
      path: 'account/login',
      title: 'Login',
      element: <AccountLoginRedirect />
    },<% } %>
    {
      path: 'account/*',
      title: 'Account',
      element: <RemoteLoader module="components-admin:Account" baseUrl={baseUrl + '/account'} systemName={systemName} />
    },
    {
      path: 'admin/initAdmin',
      title: 'Init Admin',
      element: (
        <Protected>
          <AppChildrenRouter
            element={<AfterUserLoginLayout />}
            list={[
              {
                index: true,
                element: <RemoteLoader module="components-admin:Admin@InitAdmin" />
              }
            ]}
          />
        </Protected>
      )
    },
    {
      path: 'admin/*',
      title: 'Admin',
      element: (
        <Protected>
          <AppChildrenRouter
            errorPage
            notFoundPage
            baseUrl={baseUrl + '/admin'}
            element={<AfterAdminUserLoginLayout navigation={adminNavigation} />}
            list={[
              {
                index: true,
                element: <Navigate to={`${baseUrl}/admin/user`} replace />
              },
              {
                path: 'file',
                title: '文件管理',
                element: <RemoteLoader module="components-file-manager:FileListPage" />
              }<% if (includeOidc) { %>,
              !isOidcClient && {
                path: 'oidc/*',
                title: '统一认证',
                element: <RemoteLoader module="components-admin:OidcAdmin" baseUrl={`${baseUrl}/admin/oidc`} />
              }<% } %>
            ].filter(Boolean)}>
            <RemoteLoader module="components-admin:Admin" baseUrl={baseUrl + '/admin'} />
          </AppChildrenRouter>
        </Protected>
      )
    },
    {
      path: '*',
      element: <Navigate to={`${baseUrl}/admin`} replace />
    }
  ];

  return (
    <Global preset={globalPreset} themeToken={globalPreset.themeToken}>
      <AppChildrenRouter errorPage notFoundPage baseUrl={baseUrl} list={routes} />
    </Global>
  );
});

export default App;
