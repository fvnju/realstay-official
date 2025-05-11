import React, { useRef, useEffect, useState, ReactNode } from "react";
import {
  StyleProp,
  TouchableOpacity,
  ViewStyle,
  View,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";

export const MenuTrigger = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export const MenuOption = ({
  onSelect,
  children,
  style,
}: {
  onSelect: () => void;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <TouchableOpacity onPress={onSelect} style={[style, styles.menuOption]}>
      {children}
    </TouchableOpacity>
  );
};

interface DropdownMenuProps {
  visible: boolean;
  handleClose: () => void;
  handleOpen: () => void;
  trigger: React.ReactNode;
  children: React.ReactNode;
  dropdownWidth?: number;
  itemsBackgroundColor?: string;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  visible,
  handleOpen,
  handleClose,
  trigger,
  children,
  dropdownWidth = 150,
  itemsBackgroundColor,
}) => {
  const triggerRef = useRef<View>(null);
  const [position, setPosition] = useState({ x: 0, y: 0, width: 0 });

  useEffect(() => {
    if (triggerRef.current && visible) {
      triggerRef.current.measure((fx, fy, width, height, px, py) => {
        setPosition({
          x: px,
          y: py + height,
          width,
        });
      });
    }
  }, [visible]);

  return (
    <View style={{ alignSelf: "flex-start" }}>
      <TouchableWithoutFeedback
        style={{ alignSelf: "flex-start" }}
        onPress={handleOpen}
      >
        <View ref={triggerRef}>{trigger}</View>
      </TouchableWithoutFeedback>
      {visible && (
        <Modal
          transparent
          visible={visible}
          animationType="fade"
          onRequestClose={handleClose}
        >
          <TouchableWithoutFeedback onPress={handleClose}>
            <View style={styles.modalOverlay}>
              <View
                style={[
                  styles.menu,
                  {
                    top: position.y + 8,
                    //left: position.x + position.width / 2 - dropdownWidth / 2,
                    width: dropdownWidth,
                    left: 16,
                    backgroundColor: itemsBackgroundColor,
                  },
                ]}
              >
                {children}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "transparent",
  },
  menu: {
    position: "absolute",
    width: 80,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  menuOption: {
    paddingLeft: 16,
    height: 48,
    justifyContent: "center",
  },
});
