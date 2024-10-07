import { Layout } from 'react-admin';
import { menu } from './Menu';
import { ReactNode } from 'react';

interface MyLayoutProps {
    children: ReactNode;
}

export const layout = ({ children }: MyLayoutProps) => (
    <Layout menu={menu}>
        {children}
    </Layout>
);