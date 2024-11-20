export function IndefiniteLoader(props: any): React.ReactElement | null {
    // Simulate indefinite suspension
    throw new Promise(() => {
      // This promise never resolves
    });
  
}
  