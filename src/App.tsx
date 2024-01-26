import React from 'react'
import { ApolloProvider } from '@apollo/client'
import { AuthProvider } from '@/contexts/AuthContext'
import { SideMenuProvider } from '@/contexts/SideMenuContext'
import RootComponent from '@/RootComponent'
import client from '@/plugins/apollo-client.js'

const App: React.FC = () => {
    return (
        <ApolloProvider client={client}>
            <AuthProvider>
                <SideMenuProvider>
                    <RootComponent />
                </SideMenuProvider>
            </AuthProvider>
        </ApolloProvider>
    )
}

export default App
