import { Box } from '@chakra-ui/react';
import React from 'react';
import { Pattern } from '../maku-classes/Pattern';

interface EditorMenuProps {
    patterns: Pattern[];
    children?: React.ReactNode;
}

const EditorMenu: React.FC<any> = (props: EditorMenuProps) => {
    return (
        <Box pl={2} pr={6} maxH="full">
            {props.children}
        </Box>
    );
};

export default EditorMenu;
