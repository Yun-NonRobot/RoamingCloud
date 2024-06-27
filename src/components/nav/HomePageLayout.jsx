import React from 'react';
import { Outlet } from 'react-router-dom';
import BadgerBudsNavbar from './BadgerBudsNavbar';

export default function HomePageLayout() {
    return (
        <div>
            <BadgerBudsNavbar />
            <Outlet />
        </div>
    );
}
