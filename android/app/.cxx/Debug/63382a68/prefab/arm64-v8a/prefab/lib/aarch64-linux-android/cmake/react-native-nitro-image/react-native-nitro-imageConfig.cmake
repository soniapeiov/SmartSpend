if(NOT TARGET react-native-nitro-image::NitroImage)
add_library(react-native-nitro-image::NitroImage SHARED IMPORTED)
set_target_properties(react-native-nitro-image::NitroImage PROPERTIES
    IMPORTED_LOCATION "/Users/sukrankurt/Desktop/project/SmartSpend/node_modules/react-native-nitro-image/android/build/intermediates/cxx/Debug/15491xf4/obj/arm64-v8a/libNitroImage.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/sukrankurt/Desktop/project/SmartSpend/node_modules/react-native-nitro-image/android/build/headers/nitroimage"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

