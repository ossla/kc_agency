import React from "react"

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: any, info: any) {
    console.error(error, info)
  }

  render() {
    if (this.state.hasError) {
      return <div>Что-то пошло не так.</div>;
    }
    return this.props.children
  }
}