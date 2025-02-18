import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigate(name) {
    if (navigationRef.isReady()) {
        navigationRef.navigate(name);
    }
}

export function resetNavigation(index, routes) {
    if (navigationRef.isReady()) {
        navigationRef.reset({ index, routes });
    }
}