import {
  Feather,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";

export const categories = [
  {
    title: "Market",

    icon: (
      <MaterialIcons
        name="storefront"
        size={24}
        color="#ff4d6d"
      />
    ),
  },

  {
    title: "Eat and drink",

    icon: (
      <Ionicons
        name="restaurant-outline"
        size={24}
        color="#ff9800"
      />
    ),
  },

  {
    title: "Shopping",

    icon: (
      <Feather
        name="shopping-cart"
        size={24}
        color="#1f6fff"
      />
    ),
  },

  {
    title: "Gasoline",

    icon: (
      <Ionicons
        name="car-outline"
        size={24}
        color="#00c2c7"
      />
    ),
  },

  {
    title: "House",

    icon: (
      <Ionicons
        name="home-outline"
        size={24}
        color="#c061ff"
      />
    ),
  },

  {
    title: "Electricity",

    icon: (
      <Ionicons
        name="flash-outline"
        size={24}
        color="#ffb800"
      />
    ),
  },

  {
    title: "Load phone",

    icon: (
      <Ionicons
        name="phone-portrait-outline"
        size={24}
        color="#30d158"
      />
    ),
  },

  {
    title: "School",

    icon: (
      <Ionicons
        name="school-outline"
        size={24}
        color="#5e5ce6"
      />
    ),
  },

  {
    title: "Credit card",

    icon: (
      <Ionicons
        name="card-outline"
        size={24}
        color="#5ac8fa"
      />
    ),
  },
];