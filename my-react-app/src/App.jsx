import { Show, SignInButton, SignUpButton, UserButton, ClerkProvider, useUser } from '@clerk/react'
import { MainNotesView } from './components/main-notes-view'



export default function App() {

  return (
    <>
      <div>

        <header>
        <Show when="signed-out">
          <center>
            <SignInButton />
            <SignUpButton />
          </center>
          
        </Show>
        <Show when="signed-in">
          <UserButton appearance={{
                      elements: {
                        rootBox: {
                          position: "fixed",
                          right: 20
                        },
                      },
                    }}/>
          <h1>Work Companion</h1>
          <MainNotesView />
        </Show>
      </header>

      </div>
    </>
  )

}